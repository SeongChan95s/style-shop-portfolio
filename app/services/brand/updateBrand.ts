import { BrandFormData } from '@/app/lib/zod/schemas/brand';
import { HTTPError } from '../HTTPError';
import { omit } from 'lodash';
import { useSystemAlertStore } from '@/app/store';

export const updateBrand = async (data: BrandFormData) => {
	const formData = new FormData();
	console.log('formData', formData);

	Object.entries(omit(data, 'files')).forEach(([key, value]) => {
		if (typeof value === 'object' && value !== null || Array.isArray(value)) {
			formData.append(key, JSON.stringify(value));
		} else {
			formData.append(key, String(value));
		}
	});

	if (data.files) {
		const files: File[] = Array.from(data.files);
		files.forEach((file) => {
			formData.append('files', file);
		});
	}

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/brand/updateBrand`,
		{
			method: 'PUT',
			body: formData
		}
	);

	const result = await response.json();

	if (!response.ok) {
		useSystemAlertStore
			.getState()
			.push('일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
		throw new HTTPError(result.message, response.status, response.url);
	}

	useSystemAlertStore.getState().push(result.message);

	return result;
};
