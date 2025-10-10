import { FetchResponse, ProductNested } from '@/app/types';
import { HTTPError } from '../HTTPError';
import { objectToQueryString } from '@/app/utils/convert';

export interface GetProductsParams {
	match?: {
		group?: Record<string, unknown>;
		item?: Record<string, unknown>;
	};
	search?: string;
	limit?: {
		group?: number;
		item?: number;
	};
	sort?: object;
	skip?: number;
}

export const searchProducts = async ({
	match,
	search,
	limit,
	sort,
	skip
}: GetProductsParams): Promise<FetchResponse<ProductNested[]>> => {
	const queryStrings = objectToQueryString({
		match,
		search,
		limit,
		skip,
		sort
	});

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/explorer/searchProducts?${queryStrings}`
	);
	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);
	return result;
};
