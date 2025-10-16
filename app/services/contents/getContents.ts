import { Content, FetchResponse } from '@/app/types';
import { HTTPError } from '../HTTPError';
import { objectToQueryString } from '@/app/utils/convert';

export const getContents = async <T extends Content>({
	search,
	match,
	limit,
	sort,
	skip
}: {
	search?: string;
	match?: object;
	sort?: object;
	limit?: number;
	skip?: number;
}): Promise<FetchResponse<T[]>> => {
	const queryStrings = objectToQueryString({
		search,
		match,
		limit,
		sort,
		skip
	});

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/content/getContent?${queryStrings}`
	);
	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);
	return result;
};
