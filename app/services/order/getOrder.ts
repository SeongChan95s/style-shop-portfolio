import { FetchResponse, Order } from '@/app/types';
import { HTTPError } from '../HTTPError';

export const getOrder = async (
	orderId: string,
	decodedCookie?: string
): Promise<FetchResponse<Order<string>>> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/order/getOrder?orderId=${orderId}`,
		{
			headers: {
				Cookie: decodedCookie || ''
			}
		}
	);
	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);
	return result;
};
