import { Brand, FetchResponse } from '@/app/types';
import { HTTPError } from '../HTTPError';

export const getBrandById = async (id: string): Promise<FetchResponse<Brand>> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/brand/getBrandById?id=${id}`
	);
	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);
	return result;
};