import { HTTPError } from '../HTTPError';
import { getProductsNestedByItemsId } from '../product';
import { getOrder } from './getOrder';

export const getOrderProducts = async (orderId: string, decodedCookie?: string) => {
	const getOrderResult = await getOrder(orderId, decodedCookie);
	if (!getOrderResult.success) throw new HTTPError(getOrderResult.message);

	const productItemsId = getOrderResult.data.products.map(p => p.productItemId);
	const getProductsResult = await getProductsNestedByItemsId(productItemsId);
	if (!getProductsResult.success) throw new HTTPError(getProductsResult.message);

	const products = getProductsResult.data.map((data, i) => ({
		...data,
		count: getOrderResult.data.products[i].count
	}));

	return {
		success: true,
		data: products
	};
};
