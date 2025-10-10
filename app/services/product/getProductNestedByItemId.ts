import { FetchResponse, ProductNested } from '@/app/types';
import { HTTPError } from '../HTTPError';

export const getProductNestedByItemId = async (
	itemId: string
): Promise<FetchResponse<ProductNested>> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/product/getProductNestedByItemId?itemId=${itemId}`
	);
	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);
	return result;
};
