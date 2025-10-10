import { Brand } from '@/app/types';
import { Image } from '@/app/components/common/ImageUploader/ImageUploader.types';
import dotFormDataToObject from '@/app/utils/convert/dotFormDataToObject';
import { HTTPError } from '../HTTPError';
import { s3UpdateImages } from '../s3/s3UpdateImages';

export const updateBrandById = async (formData: FormData, images: Image[]) => {
	const body = dotFormDataToObject<Brand>(formData);

	if (typeof body.images === 'string') {
		body.images = (body.images as string).split(',');
	}
	await s3UpdateImages(images);

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/brand/updateBrandById`,
		{
			method: 'PUT',
			body: JSON.stringify(body)
		}
	);
	const result = await response.json();
	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);

	return result;
};
