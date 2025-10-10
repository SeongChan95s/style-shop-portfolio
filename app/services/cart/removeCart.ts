import { FetchResponse } from '@/app/types';
import { HTTPError } from '../HTTPError';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

export const removeCart = async (
	productItemId: string,
	cookie?: ReadonlyRequestCookies
): Promise<FetchResponse> => {
	const headers: Record<string, string> = {};

	if (cookie) {
		headers['Cookie'] = decodeURIComponent(cookie.toString());
	}

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/cart/removeCart`,
		{
			method: 'PUT',
			body: JSON.stringify({
				productItemId
			}),
			headers
		}
	);
	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);

	return result;
};
