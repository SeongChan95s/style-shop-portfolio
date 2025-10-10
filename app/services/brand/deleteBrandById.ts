import { FetchResponse } from '@/app/types';
import { HTTPError } from '../HTTPError';

export const deleteBrandById = async (id: string): Promise<FetchResponse> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/brand/deleteBrandById`,
		{
			method: 'DELETE',
			body: JSON.stringify({ id })
		}
	);
	const result = await response.json();
	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);

	return result;
};
