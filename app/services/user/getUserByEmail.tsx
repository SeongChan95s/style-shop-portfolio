import { UserDB } from '@/app/types/next-auth';
import { HTTPError } from '../HTTPError';

export const getUserByEmail = async (email: string): Promise<UserDB> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/user/getUserByEmail?email=${email}`
	);
	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);

	return result;
};
