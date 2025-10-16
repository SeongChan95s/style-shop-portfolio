import { ImagePickerItem } from '@/app/components/common/ImagePicker/ImagePicker';
import { contentEditFormSchema } from '@/app/lib/zod/schemas/admin';
import { s3Delete, s3Upload } from '@/app/services/aws';
import { Content } from '@/app/types';
import { parseJsonFields } from '@/app/utils/convert/parseJsonFields';
import { connectDB } from '@/app/utils/db/database';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

type ContentFormData = {
	_id: string;
	name: string;
	title: string;
	body: string;
	url?: string;
	images: ImagePickerItem[];
};

export async function PUT(req: NextRequest) {
	try {
		const formData = await req.formData();
		const isNew = formData.get('isNew') === 'true';
		const formDataObject = Object.fromEntries(formData);
		const parsedFormData = parseJsonFields(formDataObject, ['images']) as ContentFormData;

		const files = formData.getAll('files') as File[];

		parsedFormData.images.forEach(image => {
			if (image.state === 'upload') {
				const matchingFile = files.find(file => file.name === image.key);
				if (matchingFile) {
					image.file = matchingFile;
				}
			}
		});

		const validation = contentEditFormSchema.safeParse(parsedFormData);

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
		const { _id, name, title, body, url, images } = validationData;

		const db = (await connectDB).db(process.env.MONGODB_NAME);

		const imagesToUpload = images.filter(img => img.state == 'upload');
		let uploadResultData: string[] = [];
		if (imagesToUpload.length > 0) {
			const result = await s3Upload(
				imagesToUpload.map(img => img.file).filter((file): file is File => file != null),
				`contents/${_id}`,
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
		images.forEach(img => {
			if (img.state == 'upload') {
				img.key = uploadResultData[uploadIndex];
				uploadIndex++;
			}
		});

		const imagesToDelete = images.filter(img => img.state == 'delete');
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
		const finalImages = images.filter(img => img.state !== 'delete').map(img => img.key);

		// MongoDB 업데이트 또는 생성
		if (isNew) {
			await db.collection<Content>('contents').insertOne({
				_id: new ObjectId(_id),
				name,
				title,
				body,
				url: url || '',
				images: finalImages
			});
		} else {
			await db.collection<Content>('contents').updateOne(
				{ _id: new ObjectId(_id) },
				{
					$set: {
						name,
						title,
						body,
						url: url || '',
						images: finalImages
					}
				}
			);
		}

		return NextResponse.json(
			{
				success: true,
				message: isNew ? '콘텐츠를 생성했습니다.' : '콘텐츠 정보를 수정했습니다.'
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ success: false, message: `${error}` }, { status: 500 });
	}
}
