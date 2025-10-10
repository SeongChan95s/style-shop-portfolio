import { UserDB } from '@/app/types/next-auth';
import { HTTPError } from '../HTTPError';
import { FetchResponse } from '@/app/types';

export const getUserBySession = async (): Promise<FetchResponse<UserDB>> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/user/getUserBySession`
	);
	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);

	return result;
};
