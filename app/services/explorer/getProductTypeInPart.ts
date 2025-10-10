import { FetchResponse } from '@/app/types';
import { HTTPError } from '../HTTPError';

export const getProductTypeInPart = async (): Promise<
	FetchResponse<Record<string, string[]>>
> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/explorer/getProductTypeInPart`
	);
	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);
	return result;
};
