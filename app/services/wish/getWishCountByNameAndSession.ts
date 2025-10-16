import { FetchResponse } from '@/app/types';
import { HTTPError } from '../HTTPError';

export const getWishCountByNameAndSession = async (
	name: string
): Promise<FetchResponse<number>> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/wish/getWishCountByNameAndSession?name=${name}`
	);
	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);
	return result;
};
