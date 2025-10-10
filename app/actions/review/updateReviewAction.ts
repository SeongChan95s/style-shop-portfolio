'use server';

import { parseImagePickerFormData } from '@/app/components/common/ImagePicker/ImagePicker.utils';
import { getSession } from '../auth/authActions';
import { reviewFormDataSchema } from '@/app/lib/zod/schemas/review';
import { s3Delete, s3Upload } from '@/app/services/aws';
import { ObjectId } from 'mongodb';
import { connectDB } from '@/app/utils/db/database';
import { omit } from 'lodash';
import { ProductItemCollection } from '@/app/types';

export const updateReviewAction = async (
	_prev: {
		success: boolean;
		message: string;
	},
	formData: FormData
) => {
	try {
		const session = await getSession();
		if (!session)
			return {
				success: false,
				message: '로그인이 필요합니다.'
			};

		const initialReviewData = {
			_id: formData.get('_id')
				? new ObjectId(formData.get('_id') as string)
				: new ObjectId(),
			productItemId:
				formData.get('productItemId') &&
				new ObjectId(formData.get('productItemId') as string),
			orderId: formData.get('orderId') && new ObjectId(formData.get('orderId') as string),
			content: {
				text: formData.get('content.text')
			},
			userEmail: session.user.email,
			score: formData.get('score'),
			timestamp: new Date().getTime()
		};

		const validation = reviewFormDataSchema.safeParse(initialReviewData);
		if (!validation.success)
			return {
				success: false,
				message: validation.error.issues[0].message
			};

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const productItem = await db
			.collection<ProductItemCollection>('productItems')
			.findOne({ _id: validation.data.productItemId });
		if (!productItem)
			return {
				success: false,
				message: '없는 productItem ID 입니다.'
			};
		validation.data.productGroupId = productItem.groupId;

		const images = parseImagePickerFormData(formData, 'images');

		const imagesToUpload = images
			.filter(image => image.state == 'upload')
			.map(image => image.file);
		if (imagesToUpload.length > 0) {
			const response = await s3Upload(imagesToUpload, `reviews/${validation.data._id}`);
			if (!response.success) return response;
			let i = 0;
			images.map(img => {
				if (img.state == 'upload') {
					img.key = response.data[i];
					i++;
				}
			});
		}

		const imagesToDelete = images.filter(image => image.state == 'delete');
		if (imagesToDelete.length > 0) {
			const response = await s3Delete(imagesToDelete.map(img => img.key));
			if (!response.success) return response;
		}
		validation.data.content.images = images.map(img => img.key);

		await db
			.collection('reviews')
			.findOneAndUpdate(
				{ _id: validation.data._id },
				{ $set: omit(validation.data, ['_id']) },
				{ upsert: true }
			);

		return {
			success: true,
			message: '리뷰를 작성했습니다.'
		};
	} catch (error) {
		return {
			success: false,
			message: `${error}`
		};
	}
};
