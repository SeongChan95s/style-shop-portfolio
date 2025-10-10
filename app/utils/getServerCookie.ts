import { cookies } from 'next/headers';

export const getDecodedServerCookie = async () => {
	const cookie = await cookies();
	const decodedCookie = decodeURIComponent(cookie.toString());
	return decodedCookie;
};
