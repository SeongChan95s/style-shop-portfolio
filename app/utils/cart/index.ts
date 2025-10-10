import { Cart } from '@/app/types';

export const getCheckedCarts = (
	cartsState: { cartId: string; checked: boolean; count: number }[],
	carts: Cart[]
): Cart[] => {
	return cartsState
		.filter(state => state.checked)
		.map(state => {
			const cartIndex = carts.findIndex(cart => cart.cartId === state.cartId);
			return cartIndex !== -1 ? { ...carts[cartIndex], count: state.count } : null;
		})
		.filter((cart): cart is Cart => cart !== null);
};

interface CalculatePriceParams {
	price: {
		cost: number;
		discount: number;
	};
	count: number;
}

export const calculatePrices = (products: CalculatePriceParams[]) => {
	const amount = products.reduce((total, product) => total + product.count, 0);
	const totalPrice = products.reduce(
		(total, product) => total + product.price.cost * product.count,
		0
	);
	const totalDiscount = products.reduce(
		(total, product) =>
			total + (product.price.cost * product.count * product.price.discount) / 100,
		0
	);
	const expectedCost = totalPrice - totalDiscount;

	return { amount, totalPrice, totalDiscount, expectedCost };
};
