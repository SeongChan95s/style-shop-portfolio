import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import isEqual from 'lodash/isEqual';
import { Cart } from '@/app/types';
import { pick } from 'lodash';

type CartState = {
	cartId: string;
	count: number;
	option: { [key: string]: string };
	checked: boolean;
};

interface CartStore {
	carts: CartState[];
	setCarts: (carts: CartState[]) => void;
	deleteCart: (cartId: Cart) => void;
	setCheckedCart: (value: { cartId: string; [key: string]: string | number }) => void;
	checkCart: (cartId: string) => void;
	unCheckCart: (cartId: string) => void;
	checkAll: () => void;
	clearCheck: () => void;
}

export const useCartStore = create(
	devtools(
		subscribeWithSelector(
			persist<CartStore>(
				set => ({
					carts: [],
					setCarts: value => {
						set({ carts: value });
					},
					deleteCart: value => {
						set(store => {
							const targetIndex = store.carts.findIndex(state => {
								return isEqual(
									pick(state, ['cartId', 'option']),
									pick(value, ['cartId', 'option'])
								);
							});

							return {
								carts: [
									...store.carts.slice(0, targetIndex),
									...store.carts.slice(targetIndex + 1)
								]
							};
						});
					},
					setCheckedCart: value => {
						set(store => {
							const { cartId } = value;
							const newCarts = store.carts.map(cart => {
								if (cart.cartId == cartId) {
									return { ...cart, ...value };
								}
								return cart;
							});

							return { carts: newCarts };
						});
					},
					checkCart: cartId => {
						set(store => {
							const newCarts = store.carts.map(cart => {
								if (cart.cartId == cartId) {
									cart.checked = true;
								}
								return cart;
							});
							return { carts: newCarts };
						});
					},
					unCheckCart: cartId => {
						set(store => {
							const newCarts = store.carts.map(cart => {
								if (cart.cartId == cartId) {
									cart.checked = false;
								}
								return cart;
							});
							return { carts: newCarts };
						});
					},
					checkAll: () => {
						set(store => {
							const newCarts = store.carts.map(cart => ({
								...cart,
								checked: true
							}));
							return { carts: newCarts };
						});
					},
					clearCheck: () => {
						set(store => {
							const newCarts = store.carts.map(cart => ({
								...cart,
								checked: false
							}));
							return { carts: newCarts };
						});
					}
				}),
				{
					name: 'cart'
				}
			)
		)
	)
);
