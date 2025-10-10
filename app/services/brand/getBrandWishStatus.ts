import { FetchResponse } from '@/app/types';
import { HTTPError } from '../HTTPError';

interface BrandWishStatusResponse {
	isWished: boolean;
	wishCount: number;
}

export const getBrandWishStatus = async (
	brandId: string
): Promise<FetchResponse<BrandWishStatusResponse>> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/brand/getBrandWishStatus?brandId=${brandId}`,
		{
			method: 'GET'
		}
	);
	const result = await response.json();
	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);

	return result;
};
