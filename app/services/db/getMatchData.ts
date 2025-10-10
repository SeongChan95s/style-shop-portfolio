import { objectToQueryString } from '@/app/utils/convert';
import { HTTPError } from '../HTTPError';
import { FetchResponse } from '@/app/types';

export async function getMatchData<T>(
	collection: string,
	match: object
): Promise<FetchResponse<T>> {
	const queryStrings = objectToQueryString({
		collection,
		match
	});

	const response = await fetch(`/api/db/getMatchData?${queryStrings}`);
	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);

	return result;
}
