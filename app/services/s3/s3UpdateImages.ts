import { Image } from '@/app/components/common/ImageUploader/ImageUploader.types';
import { s3Upload } from '.';
import { HTTPError } from '../HTTPError';
import { FetchResponse } from '@/app/types';

export const s3UpdateImages = async (images: Image[]): Promise<FetchResponse> => {
	try {
		// image s3 upload
		const imagesToUpload = images.filter(image => image.state == 'uploaded');
		if (imagesToUpload.length > 0) {
			const uploadPromises = imagesToUpload.map(image => {
				if (image.file instanceof File) {
					return s3Upload(image);
				}
			});
			await Promise.all(uploadPromises);
		}

		const imagesToDelete = images.filter(image => image.state == 'deleted');
		if (imagesToDelete.length > 0) {
			const deletePromise = imagesToDelete.map(image => {
				if (image.file instanceof File) {
					return s3Upload(image);
				}
			});
			await Promise.all(deletePromise);
		}

		return { success: true, message: '이미지를 수정했습니다.' };
	} catch (error) {
		if (error instanceof Error) throw new HTTPError(error.message, 400);
		throw new HTTPError('알수없는 이유로 이미지 수정에 실패했습니다.', 400);
	}
};
