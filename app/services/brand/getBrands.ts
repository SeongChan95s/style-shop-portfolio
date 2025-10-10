import { Brand, FetchResponse } from '@/app/types';
import { HTTPError } from '../HTTPError';
import { objectToQueryString } from '@/app/utils/convert';

interface params {
	match?: object;
	sort?: object;
	skip?: number;
	limit?: number;
}

export const getBrands = async ({
	match,
	limit,
	sort,
	skip
}: params): Promise<FetchResponse<Brand[]>> => {
	const queryStrings = objectToQueryString({
		match,
		limit,
		skip,
		sort
	});

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/brand/getBrands?${queryStrings}`
	);
	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);
	return result;
};
