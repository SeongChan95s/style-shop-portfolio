import { ProductNested } from '@/app/types';
import { HTTPError } from '../HTTPError';

export const getProductsByGroupId = async (productId: string): Promise<ProductNested> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/product/getProductsByGroupId?productId=${productId}`,
		{
			cache: 'force-cache'
		}
	);

	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);
	return result;
};
