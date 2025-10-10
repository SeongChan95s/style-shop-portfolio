import { Content, FetchResponse } from '@/app/types';
import { HTTPError } from '../HTTPError';
import { objectToQueryString } from '@/app/utils/convert';

interface SearchContentsParams {
	match?: Record<string, unknown>;
	search?: string;
	limit?: number;
	sort?: object;
	skip?: number;
}

export const searchContents = async ({
	match,
	search,
	limit,
	sort,
	skip
}: SearchContentsParams): Promise<FetchResponse<Content[]>> => {
	const queryStrings = objectToQueryString({
		match,
		search,
		limit,
		skip,
		sort
	});

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/explorer/searchContents?${queryStrings}`
	);
	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);
	return result;
};
