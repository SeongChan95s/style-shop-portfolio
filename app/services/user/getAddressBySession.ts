import { HTTPError } from '../HTTPError';
import { Address, FetchResponse } from '@/app/types';

export const getAddressBySession = async (
	decodedCookie?: string
): Promise<FetchResponse<Address<string>[]>> => {
	const headers: Record<string, string> = {};
	if (decodedCookie) {
		headers['Cookie'] = decodedCookie;
	}

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/user/getAddressBySession`,
		{
			headers
		}
	);
	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);

	return result;
};
