import { FetchResponse, ProductNested } from '@/app/types';
import { HTTPError } from '../HTTPError';
import { objectToQueryString } from '@/app/utils/convert';

interface GetWishProductsBySessionParams {
	sort?: object;
	skip?: number;
	limit?: number;
}

export const getWishProductsBySession = async ({
	sort,
	skip,
	limit
}: GetWishProductsBySessionParams): Promise<FetchResponse<ProductNested[]>> => {
	const queryStrings = objectToQueryString({ sort, skip, limit });

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/wish/getWishProductsBySession?${queryStrings}`
	);
	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);
	return result;
};
