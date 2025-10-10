import { FetchResponse, Review } from '@/app/types';
import { HTTPError } from '../HTTPError';
import { objectToQueryString } from '@/app/utils/convert';

interface params {
	itemId?: string;
	groupId?: string;
	match?: object;
	limit?: number;
	sort?: object;
	skip?: number;
}

export const getReviewsByProductId = async ({
	groupId,
	itemId,
	match,
	limit,
	sort,
	skip
}: params): Promise<FetchResponse<Review<string>[]>> => {
	const queryStrings = objectToQueryString({
		groupId,
		itemId,
		match,
		limit,
		skip,
		sort
	});

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/review/getReviewsByProductId?${queryStrings}`
	);

	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);
	return result;
};
