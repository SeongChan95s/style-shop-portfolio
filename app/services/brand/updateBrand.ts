import { BrandFormData } from '@/app/(route)/(desktop)/admin/brand/edit/[id]/BrandForm';
import { HTTPError } from '../HTTPError';
import { omit } from 'lodash';
import { useSystemAlertStore } from '@/app/store';

export const updateBrand = async (data: BrandFormData) => {
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
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/brand/updateBrand`,
		{
			method: 'PUT',
			body: formData
		}
	);

	const result = await response.json();

	if (!response.ok) {
		useSystemAlertStore.getState().push(result.message || 'Error occurred');
		throw new HTTPError(result.message, response.status, response.url);
	}

	useSystemAlertStore.getState().push(result.message);

	return result;
};
