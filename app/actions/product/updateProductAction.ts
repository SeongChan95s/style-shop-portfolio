'use server';

import { ImagePickerItem } from '@/app/components/common/ImagePicker/ImagePicker';
import { parseImagePickerFormData } from '@/app/components/common/ImagePicker/ImagePicker.utils';
import { productEditFormSchema } from '@/app/lib/zod/schemas/admin';
import { s3Delete, s3Upload } from '@/app/services/aws';
import { FetchResponse, ProductItemCollection } from '@/app/types';
import { formDataToNested } from '@/app/utils/convert/object';
import { connectDB } from '@/app/utils/db/database';
import { omit } from 'lodash';
import { ObjectId } from 'mongodb';

type ProductFormData = {
	_id: string;
	name: string;
	brand: string;
	price: { cost: string; discount: string };
	category: { gender: string; type: string; part: string; main: string };
	keywords: string;
	items: {
		_id: string | ObjectId;
		groupId: string;
		option: { color: string; size: string };
		stock: string;
		images: string[] | string;
		state?: 'create' | 'delete';
	}[];
};

export const updateProductAction = async (
	initialData: FetchResponse,
	formData: FormData
): Promise<FetchResponse> => {
	try {
		const nestedFormData = formDataToNested(formData) as ProductFormData;

		console.log('nestedFormData', nestedFormData);
		const nestedFormDataWithImages = {
			...nestedFormData,
			items: nestedFormData?.items
				? Object.values(nestedFormData.items).map(item => ({
						...item,
						images: parseImagePickerFormData(formData, `items.${item._id}.images`)
					}))
				: []
		};

		const validation = productEditFormSchema.safeParse(nestedFormDataWithImages);
		console.log(validation.error);

		if (validation.error)
			return {
				success: false,
				message: validation.error.issues[0].message
			};
		const validationData = validation.data;

		const { _id, name, brand, price, category, items } = validationData;
		let { keywords } = validationData;
		// 키워드 자동추가
		let keywordsFromItems = items.flatMap(item => Object.values(item.option)) as string[];
		keywordsFromItems = [...new Set([...keywordsFromItems])];
		keywords = [
			...new Set([...keywords, ...Object.values(category), ...keywordsFromItems])
		];

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		await db
			.collection('productGroups')
			.updateOne(
				{ _id },
				{ $set: { name, brand, price, category, keywords } },
				{ upsert: true }
			);

		// s3 upload & delete
		const imagesToS3 = validationData.items.flatMap(
			item => item.images
		) as ImagePickerItem[];

		const imagesToUpload = imagesToS3.filter(img => img.state == 'upload');
		let uploadResultData: string[];
		if (imagesToUpload.length > 0) {
			const result = await s3Upload(
				imagesToUpload.map(img => img.file),
				`products/clothes/${validationData._id.toString()}`
			);
			if (!result.success)
				return {
					success: false,
					message: result.message
				};
			uploadResultData = result.data;
		}
		let i = 0;
		items.map(item => {
			item.images.map(img => {
				if (img.state == 'upload') {
					img.key = uploadResultData[i];
					i++;
				}
			});
		});

		const imagesToDelete = imagesToS3.filter(img => img.state == 'delete');
		if (imagesToDelete.length > 0) {
			const result = await s3Delete(imagesToDelete.map(img => img.key));
			if (!result.success)
				return {
					success: false,
					message: result.message
				};
		}

		// productItem
		// update item
		const updateItems = items.filter(
			item => item.state !== 'create' && item.state !== 'delete'
		);
		if (updateItems.length > 0) {
			const pipe = updateItems.map(item => {
				const images = item.images
					.filter(img => img.state !== 'delete')
					.map(img => img.key);
				return {
					updateOne: {
						filter: { _id: item._id as ObjectId },
						update: { $set: { option: item.option, stock: item.stock, images } }
					}
				};
			});

			await db.collection<ProductItemCollection>('productItems').bulkWrite(pipe);
		}

		// create item
		const itemsToCreate = items.filter(item => item.state == 'create');
		console.log('itemsToCreate', itemsToCreate);
		if (itemsToCreate.length > 0) {
			const newItems = itemsToCreate.map(item => {
				const images = item.images.map(img => img.key);
				return { ...omit(item, 'state'), images };
			});

			await db.collection<ProductItemCollection>('productItems').insertMany(newItems);
		}

		// delete item
		const itemsToDelete = items.filter(item => item.state === 'delete');
		if (itemsToDelete.length > 0) {
			await db.collection<ProductItemCollection>('productItems').deleteMany({
				_id: { $in: itemsToDelete.map(item => item._id as ObjectId) }
			});

			// 이미지가 다른 아이템에 있는지 체크하여 없으면 삭제
			const itemImagesToDelete = itemsToDelete.flatMap(item =>
				item.images.flatMap(img => img.key)
			);
			const findedItems = await db
				.collection<ProductItemCollection>('productItems')
				.find(
					{ images: { $in: itemImagesToDelete } },
					{ projection: { images: { $elemMatch: { $in: itemImagesToDelete } } } }
				)
				.toArray();
			const existingImages = findedItems.flatMap(el => el.images);

			const imagesToDelete = itemImagesToDelete.filter(
				img => !existingImages.includes(img)
			);

			const deleteResult = await s3Delete(imagesToDelete);
			if (!deleteResult.success)
				return {
					success: false,
					message: deleteResult.message
				};
		}

		return { success: true, message: '상품정보를 수정했습니다.' };
	} catch (error) {
		return { success: false, message: `${error}` };
	}
};
