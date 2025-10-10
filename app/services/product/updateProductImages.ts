import { Image } from '@/app/components/common/ImageUploader/ImageUploader.types';
import { s3Upload } from '../s3';

export const updateProductImages = async (productItemId: string, images: Image[]) => {
	try {
		// image s3 upload
		const addedImages = images.filter(image => image.state == 'uploaded');
		if (addedImages.length > 0) {
			const uploadPromises = addedImages.map(image => {
				if (image.file instanceof File) {
					return s3Upload(image);
				}
			});
			await Promise.all(uploadPromises);
		}

		const removedImages = images.filter(image => image.state == 'deleted');
		const imagesToDelete = removedImages.flatMap(img => img.key);

		await fetch(`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/product/deleteProductImages`, {
			method: 'DELETE',
			body: JSON.stringify({ targetImages: imagesToDelete })
		});

		// content Mongodb upload
		const uploadImages = images
			.filter(image => image.state != 'deleted')
			.map(image => image.key);

		await fetch(
			`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/product/updateProductItemById`,
			{
				method: 'PUT',
				body: JSON.stringify({
					productItemId,
					images: uploadImages
				})
			}
		);

		return { success: true, message: '이미지를 수정했습니다.' };
	} catch (error) {
		return { success: false, message: `${error}` };
	}
};
