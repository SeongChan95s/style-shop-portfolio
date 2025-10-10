import { FetchResponse, ProductNested } from '@/app/types';
import { HTTPError } from '../HTTPError';
import { objectToQueryString } from '../../utils/convert';

interface GetProductsParams {
	match?: {
		group?: object;
		item?: object;
	};
	limit?: {
		group?: number;
		item?: number;
		total?: number;
	};
	sort?: {
		group?: object;
		item?: object;
	};
	skip?: number;
}

export const getProductsNestedByGroups = async ({
	match,
	limit,
	sort,
	skip
}: GetProductsParams): Promise<FetchResponse<ProductNested[]>> => {
	const queryStrings = objectToQueryString({
		match,
		limit,
		skip,
		sort
	});

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/product/getProductsNestedByGroups?${queryStrings}`
	);
	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);
	return result;
};
