import { FetchResponse } from '@/app/types';
import { HTTPError } from '../HTTPError';

export const deleteOrder = async (
	orderId: string,
	decodedCookie?: string
): Promise<FetchResponse> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/order/deleteOrder?orderId=${orderId}`,
		{
			method: 'DELETE',
			headers: {
				Cookie: decodedCookie || ''
			}
		}
	);
	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);
	return result;
};
