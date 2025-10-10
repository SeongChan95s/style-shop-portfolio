import { objectToQueryString } from '@/app/utils/convert';
import { HTTPError } from '../HTTPError';

export const getUserWishByProduct = async (name: string, targetId: string) => {
	const queryStrings = objectToQueryString({ targetId, name });

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/wish/getUserWishByProduct?${queryStrings}`
	);
	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status);
	return result;
};
