import { FetchResponse, ProductNested } from '@/app/types';
import { HTTPError } from '../HTTPError';
import { objectToQueryString } from '@/app/utils/convert';

export const getProductsByView = async ({
	search,
	match,
	period,
	sort,
	limit
}: {
	search?: string;
	match?: object;
	period: number;
	sort?: object;
	limit?: object;
}): Promise<FetchResponse<ProductNested[]>> => {
	const queryStrings = objectToQueryString({
		search,
		match,
		period,
		sort,
		limit
	});

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/product/getProductsByView?${queryStrings}`
	);
	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);

	return result;
};
