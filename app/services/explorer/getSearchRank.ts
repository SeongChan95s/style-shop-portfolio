import { FetchResponse, Search } from '@/app/types';
import { HTTPError } from '../HTTPError';

export const getSearchRank = async (): Promise<
	FetchResponse<(Search & { state: 'up' | 'none' | 'down' | 'new' })[]>
> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/explorer/getSearchRank`
	);
	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);
	return result;
};
