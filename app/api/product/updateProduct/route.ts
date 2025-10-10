import { ImagePickerItem } from '@/app/components/common/ImagePicker/ImagePicker';
import { productEditFormSchema } from '@/app/lib/zod/schemas/admin';
import { s3Delete, s3Upload } from '@/app/services/aws';
import { ProductItemCollection } from '@/app/types';
import { parseJsonFields } from '@/app/utils/convert/parseJsonFields';
import { connectDB } from '@/app/utils/db/database';
import { omit } from 'lodash';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

type ProductFormData = {
	_id: string;
	name: string;
	brand: string;
	price: { cost: string; discount: string };
	category: { gender: string; type: string; part: string; main: string };
	keywords: string[];
	items: {
		_id: string | ObjectId;
		groupId: string;
		option: { color: string; size: string };
		stock: string;
		images: ImagePickerItem[];
		state?: 'create' | 'delete';
	}[];
};

export async function PUT(req: NextRequest) {
	try {
		const formData = await req.formData();
		const formDataObject = Object.fromEntries(formData);
		const parsedFormData = parseJsonFields(formDataObject, [
			'price',
			'category',
			'keywords',
			'items'
		]) as ProductFormData;

		const files = formData.getAll('files') as File[];

		parsedFormData.items.forEach(item => {
			item.images.forEach(image => {
				if (image.state === 'upload') {
					const matchingFile = files.find(file => file.name === image.key);
					if (matchingFile) {
						image.file = matchingFile;
					}
				}
			});
		});
		const validation = productEditFormSchema.safeParse(parsedFormData);
		console.error(validation.error);

		if (validation.error)
			return NextResponse.json(
				{
					success: false,
					message: validation.error.issues[0].message
				},
				{ status: 200 }
			);

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
				`products/clothes/${validationData._id.toString()}`,
				10
			);
			if (!result.success)
				return NextResponse.json({
					success: false,
					message: result.message
				});
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
				return NextResponse.json(
					{
						success: false,
						message: result.message
					},
					{ status: 500 }
				);
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
				return NextResponse.json(
					{
						success: false,
						message: deleteResult.message
					},
					{ status: 500 }
				);
		}

		return NextResponse.json(
			{ success: true, message: '상품정보를 수정했습니다.' },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ success: false, message: `${error}` }, { status: 500 });
	}
}
