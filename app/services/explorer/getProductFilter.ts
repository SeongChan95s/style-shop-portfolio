import { FetchResponse } from '@/app/types';
import { HTTPError } from '../HTTPError';

export const getProductFilter = async (
	filterType?: string
): Promise<FetchResponse<Record<string, string[]>>> => {
	const queryString = filterType ? `?filterType=${filterType}` : '';

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/explorer/getProductFilter${queryString}`
	);
	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);
	return result;
};
