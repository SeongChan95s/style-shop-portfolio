'use server';

import { parseImagePickerFormData } from '@/app/components/common/ImagePicker/ImagePicker.utils';
import { ObjectId } from 'mongodb';
import { omit } from 'lodash';
import { connectDB } from '@/app/utils/db/database';
import dotFormDataToObject from '@/app/utils/convert/dotFormDataToObject';
import { BrandCollection } from '@/app/types';
import { s3Delete, s3Upload } from '@/app/services/aws';
import { BrandFormSchema } from '@/app/lib/zod/schemas/brand';

export const updateBrandAction = async (
	_prev: { success: boolean; message: string },
	formData: FormData
) => {
	try {
		const parsedFormData = dotFormDataToObject<Partial<BrandCollection>>(formData);

		const formDataToValidate = {
			_id: parsedFormData._id
				? new ObjectId(parsedFormData._id as unknown as string)
				: new ObjectId(),
			name: parsedFormData.name,
			country: parsedFormData.country,
			since: Number(parsedFormData?.since),
			desc: parsedFormData.desc
		};
		const validation = BrandFormSchema.safeParse(formDataToValidate);
		if (!validation.success) {
			return {
				success: false,
				message: validation.error.issues[0].message
			};
		}

		const imageData = parseImagePickerFormData(formData, 'images');
		const imageFiles = imageData
			.filter(data => data.state == 'upload')
			.map(data => data.file) as File[];
		const uploadResult = await s3Upload(
			imageFiles,
			`brand/${validation.data._id.toString()}`,
			3
		);
		if (!uploadResult.success)
			return {
				success: false,
				message: uploadResult.message
			};

		let i = 0;
		imageData.map(data => {
			if (data.state == 'upload') {
				data.key = uploadResult.data[i];
				i++;
			}
		});

		const imagesToDelete = imageData.filter(data => data.state == 'delete');
		await s3Delete(imagesToDelete.map(img => img.key));

		const brandData = {
			...validation.data,
			...{
				images: imageData.filter(data => data.state != 'delete').map(data => data.key)
			}
		};

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		await db
			.collection('brands')
			.findOneAndUpdate(
				{ _id: brandData._id },
				{ $set: omit(brandData, ['_id']) },
				{ upsert: true }
			);

		return {
			success: true,
			message: '브랜드 정보를 업데이트 했습니다.'
		};
	} catch (error) {
		return {
			success: false,
			message: `${error}`
		};
	}
};
