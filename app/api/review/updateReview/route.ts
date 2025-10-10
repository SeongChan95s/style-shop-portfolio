import { ImagePickerItem } from '@/app/components/common/ImagePicker/ImagePicker';
import { reviewEditFormSchema } from '@/app/lib/zod/schemas/admin';
import { s3Delete, s3Upload } from '@/app/services/aws';
import { ReviewsCollection } from '@/app/types';
import { parseJsonFields } from '@/app/utils/convert/parseJsonFields';
import { connectDB } from '@/app/utils/db/database';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

type ReviewFormData = {
	_id: string;
	userEmail?: string;
	productItemId: string;
	orderId: string;
	score: string;
	content: {
		text: string;
		images: ImagePickerItem[];
	};
};

export async function PUT(req: NextRequest) {
	try {
		const formData = await req.formData();
		const isNew = formData.get('isNew') === 'true';
		const formDataObject = Object.fromEntries(formData);
		const parsedFormData = parseJsonFields(formDataObject, ['content']) as ReviewFormData;

		const files = formData.getAll('files') as File[];

		parsedFormData.content.images.forEach(image => {
			if (image.state === 'upload') {
				const matchingFile = files.find(file => file.name === image.key);
				if (matchingFile) {
					image.file = matchingFile;
				}
			}
		});

		const validation = reviewEditFormSchema.safeParse(parsedFormData);

		if (validation.error) {
			console.error(validation.error);
			return NextResponse.json(
				{
					success: false,
					message: validation.error.issues[0].message
				},
				{ status: 400 }
			);
		}

		const validationData = validation.data;
		const { _id, userEmail, productItemId, orderId, score, content } = validationData;

		const db = (await connectDB).db(process.env.MONGODB_NAME);

		if (isNew && userEmail) {
			const user = await db.collection('users').findOne({ email: userEmail });
			if (!user) {
				return NextResponse.json(
					{
						success: false,
						message: '존재하지 않는 사용자입니다.'
					},
					{ status: 400 }
				);
			}
		}

		const imagesToUpload = content.images.filter(img => img.state == 'upload');
		let uploadResultData: string[] = [];
		if (imagesToUpload.length > 0) {
			const result = await s3Upload(
				imagesToUpload.map(img => img.file).filter((file): file is File => file != null),
				`reviews/${_id}`,
				10
			);
			if (!result.success)
				return NextResponse.json(
					{
						success: false,
						message: result.message
					},
					{ status: 500 }
				);
			uploadResultData = result.data;
		}

		// 업로드된 이미지 key 업데이트
		let uploadIndex = 0;
		content.images.forEach(img => {
			if (img.state == 'upload') {
				img.key = uploadResultData[uploadIndex];
				uploadIndex++;
			}
		});

		const imagesToDelete = content.images.filter(img => img.state == 'delete');
		if (imagesToDelete.length > 0) {
			const result = await s3Delete(imagesToDelete.map(img => img.key));
			if (!result.success)
				return NextResponse.json(
					{
						success: false,
						message: result.message
					},
					{ status: 500 }
				);
		}

		// 최종 이미지 배열 (delete 제외)
		const finalImages = content.images
			.filter(img => img.state !== 'delete')
			.map(img => img.key);

		// MongoDB 업데이트 또는 생성
		if (isNew && userEmail) {
			await db.collection<ReviewsCollection>('reviews').insertOne({
				_id: new ObjectId(_id),
				productGroupId: new ObjectId(),
				productItemId: new ObjectId(productItemId),
				orderId: new ObjectId(orderId),
				content: {
					images: finalImages,
					text: content.text
				},
				userEmail,
				score: Number(score),
				timestamp: Date.now()
			});
		} else {
			await db.collection<ReviewsCollection>('reviews').updateOne(
				{ _id: new ObjectId(_id) },
				{
					$set: {
						'content.text': content.text,
						'content.images': finalImages,
						score: Number(score)
					}
				}
			);
		}

		return NextResponse.json(
			{
				success: true,
				message: isNew ? '리뷰를 생성했습니다.' : '리뷰 정보를 수정했습니다.'
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ success: false, message: `${error}` }, { status: 500 });
	}
}
