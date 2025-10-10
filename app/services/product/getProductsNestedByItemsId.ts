import { FetchResponse, ProductNested } from '@/app/types';
import { HTTPError } from '../HTTPError';

export const getProductsNestedByItemsId = async (
	itemsId: string[]
): Promise<FetchResponse<ProductNested[]>> => {
	const itemsIdString = JSON.stringify(itemsId);

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/product/getProductsNestedByItemsId?itemsId=${itemsIdString}`,
		{
			cache: 'force-cache'
		}
	);

	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);
	return result;
};
