import { FetchResponse, BrandWithProduct } from '@/app/types';
import { HTTPError } from '../HTTPError';
import { objectToQueryString } from '@/app/utils/convert';

interface GetWishBrandsWithProductBySessionParams {
	skip?: number;
	limit?: number;
}

export const getWishBrandsWithProductBySession = async ({
	skip,
	limit
}: GetWishBrandsWithProductBySessionParams): Promise<
	FetchResponse<BrandWithProduct[]>
> => {
	const queryStrings = objectToQueryString({ skip, limit });

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/wish/getWishBrandsWithProductBySession?${queryStrings}`
	);
	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);
	return result;
};
