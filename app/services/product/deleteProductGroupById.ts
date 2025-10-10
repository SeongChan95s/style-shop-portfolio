import { FetchResponse } from '@/app/types';
import { HTTPError } from '../HTTPError';

export const deleteProductGroupById = async (groupId: string): Promise<FetchResponse> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/product/deleteProductGroupById`,
		{
			method: 'DELETE',
			body: JSON.stringify({ groupId })
		}
	);

	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);
	return result;
};
