import { ProductFormData } from '@/app/(route)/(desktop)/admin/product/edit/[id]/ProductForm';
import { HTTPError } from '../HTTPError';
import { omit } from 'lodash';
import { useSystemAlertStore } from '@/app/store';

export const updateProduct = async (data: ProductFormData) => {
	const formData = new FormData();

	Object.entries(omit(data, 'files')).map(([key, value]) => {
		if (typeof value == 'object' || Array.isArray(value)) {
			formData.append(key, JSON.stringify(value));
		} else {
			formData.append(key, String(value));
		}
	});

	if (data.files) {
		Array.from(data.files).forEach(file => {
			formData.append('files', file);
		});
	}

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/product/updateProduct`,
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
