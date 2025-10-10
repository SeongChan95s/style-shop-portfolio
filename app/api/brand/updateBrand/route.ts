import { ImagePickerItem } from '@/app/components/common/ImagePicker/ImagePicker';
import { brandEditFormSchema } from '@/app/lib/zod/schemas/admin';
import { s3Delete, s3Upload } from '@/app/services/aws';
import { BrandCollection } from '@/app/types';
import { parseJsonFields } from '@/app/utils/convert/parseJsonFields';
import { connectDB } from '@/app/utils/db/database';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

type BrandFormData = {
	_id: string | ObjectId;
	name: {
		main: string;
		sub: string;
	};
	country: string;
	since: number;
	desc: string;
	images: ImagePickerItem[];
};

export async function PUT(req: NextRequest) {
	try {
		const formData = await req.formData();
		const formDataObject = Object.fromEntries(formData);
		const parsedFormData = parseJsonFields(formDataObject, [
			'name',
			'images'
		]) as BrandFormData;

		const files = formData.getAll('files') as File[];

		// 파일과 이미지 매칭
		parsedFormData.images.forEach(image => {
			if (image.state === 'upload') {
				const matchingFile = files.find(file => file.name === image.key);
				if (matchingFile) {
					image.file = matchingFile;
				}
			}
		});

		// Zod validation
		const validation = brandEditFormSchema.safeParse(parsedFormData);

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
		const { _id, name, country, since, desc, images } = validationData;

		const db = (await connectDB).db(process.env.MONGODB_NAME);

		// S3 업로드 & 삭제
		const imagesToUpload = images.filter(img => img.state == 'upload');
		let uploadResultData: string[] = [];
		if (imagesToUpload.length > 0) {
			const result = await s3Upload(
				imagesToUpload.map(img => img.file).filter((file): file is File => file != null),
				`brands/${_id}`,
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

		// MongoDB 업데이트
		await db
			.collection<BrandCollection>('brands')
			.updateOne(
				{ _id: new ObjectId(_id) },
				{
					$set: {
						name: {
							main: name.main,
							sub: name.sub ?? ''
						},
						country,
						since: Number(since),
						desc,
						images: finalImages
					}
				},
				{ upsert: true }
			);

		return NextResponse.json(
			{ success: true, message: '브랜드 정보를 수정했습니다.' },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ success: false, message: `${error}` }, { status: 500 });
	}
}
