import { FetchResponse, OrderProducts } from '@/app/types';
import { HTTPError } from '../HTTPError';

export const getOrderProductsByOrderId = async (
	orderId: string,
	decodedCookie?: string
): Promise<FetchResponse<OrderProducts<string>>> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/order/getOrderProductsByOrderId?orderId=${orderId}`,
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
