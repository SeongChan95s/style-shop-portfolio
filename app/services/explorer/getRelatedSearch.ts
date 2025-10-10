import { FetchResponse, Search } from '@/app/types';
import { HTTPError } from '../HTTPError';

export const getRelatedSearch = async (
	search: string
): Promise<FetchResponse<Search[]>> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/explorer/getRelatedSearch?search=${search}`
	);
	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);
	return result;
};
