import { Image } from '@/app/components/common/ImageUploader/ImageUploader.types';
import { handleFetch } from '../../utils/handleFetch';
import { HTTPError } from '../HTTPError';
import { PresignedPost } from '@aws-sdk/s3-presigned-post';

export const s3Upload = async ({ file: imageFile, key: imageKey }: Image) => {
	const fileSize = imageFile?.size ?? 0;

	if (fileSize > 1048576) {
		throw new HTTPError('1MB 용량 제한을 초과했습니다.', 400);
	}

	const getPresigned = async (): Promise<PresignedPost> => {
		const response = await fetch(`/api/s3/presigned?key=${imageKey}`);
		const result = await response.json();

		if (!response.ok) throw new HTTPError(result.message, response.status, response.url);
		return result;
	};

	const [presigned, presignedError] = await handleFetch({
		queryFn: getPresigned()
	}); // 서명받기

	if (presignedError) throw new Error(presignedError.message);

	if (!(imageFile instanceof File)) return;
	const formData = new FormData();
	Object.entries(presigned.fields).forEach(([key, value]) => {
		formData.append(key, value);
	});
	formData.append('file', imageFile);

	const uploadResponse = await fetch(presigned.url, {
		method: 'POST',
		body: formData
	});

	if (!uploadResponse.ok) {
		throw new HTTPError(
			'알수없는 이유로 이미지 업로드에 실패했습니다.',
			uploadResponse.status,
			uploadResponse.url
		);
	}

	return { message: '이미지 업로드에 성공했습니다.' };
};
