import { FetchResponse, ProductNested } from '@/app/types';
import { HTTPError } from '../HTTPError';

export const getProductsNestedByGroupsId = async (
	groupsId: string[]
): Promise<FetchResponse<ProductNested[]>> => {
	const groupsdIsString = JSON.stringify(groupsId);

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/product/getProductsNestedByGroupsId?groupsId=${groupsdIsString}`,
		{
			cache: 'force-cache'
		}
	);

	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);
	return result;
};
