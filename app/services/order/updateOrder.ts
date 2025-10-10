import { FetchResponse, Order } from '@/app/types';
import { HTTPError } from '../HTTPError';

export const updateOrder = async (
	order: Partial<Order<string>>,
	decodedCookie?: string
): Promise<FetchResponse> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/order/updateOrder`,
		{
			method: 'PUT',
			body: JSON.stringify(order),
			headers: {
				Cookie: decodedCookie || ''
			}
		}
	);
	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);
	return result;
};
