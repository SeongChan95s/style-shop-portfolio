import { FetchResponse, Review } from '@/app/types';
import { HTTPError } from '../HTTPError';
import { objectToQueryString } from '@/app/utils/convert';

interface GetReviewsParams {
	search?: string;
	match?: object;
	limit?: number;
	skip?: number;
	sort?: object;
}

export const getReviews = async <T = string>({
	search,
	match,
	limit,
	skip,
	sort
}: GetReviewsParams): Promise<FetchResponse<Review<T>[]>> => {
	const queryStrings = objectToQueryString({
		search,
		match,
		limit,
		skip,
		sort
	});

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/review/getReviews?${queryStrings}`
	);
	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);

	return result;
};
