import { FetchResponse, ProductNested } from '@/app/types';
import { HTTPError } from '../HTTPError';
import { objectToQueryString } from '@/app/utils/convert';

interface params {
	match?: {
		group?: object;
		item?: object;
	};
	limit?: {
		group?: number;
		item?: number;
		total?: number;
	};
	sort?: 'latest' | 'comment';
	skip?: number;
}

export const getProducts = async ({
	match,
	limit,
	sort,
	skip
}: params): Promise<FetchResponse<ProductNested[]>> => {
	const queryStrings = objectToQueryString({
		match,
		limit,
		skip,
		sort
	});

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/product/getProducts?${queryStrings}`
	);
	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);
	return result;
};
