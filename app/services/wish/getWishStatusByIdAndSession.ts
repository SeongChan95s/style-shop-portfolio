import { objectToQueryString } from '@/app/utils/convert';
import { HTTPError } from '../HTTPError';
import { FetchResponse } from '@/app/types';

export const getWishStatusByIdAndSession = async (
	name: string,
	targetId: string
): Promise<FetchResponse<{ count: number; entry: boolean }>> => {
	const queryStrings = objectToQueryString({ targetId, name });

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/wish/getWishStatusByIdAndSession?${queryStrings}`
	);
	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status);
	return result;
};
