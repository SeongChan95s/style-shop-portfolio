'use client';

import { getCartsWithProductByUser } from '@/app/services/cart';
import { useCartStore } from './cart.store';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Cart } from '@/app/types';

export default function InitializeCart() {
	const { data, isSuccess } = useQuery({
		queryFn: () => getCartsWithProductByUser(),
		queryKey: ['cart'],
		refetchOnMount: true,
		staleTime: 0
	});

	const localCarts = useCartStore(state => state.carts);
	const setCarts = useCartStore(state => state.setCarts);

	useEffect(() => {
		if (isSuccess) {
			const serverCarts = (data.success ? data.data : [])?.map((cart: Cart) => {
				const found = localCarts.find(c => c.cartId === cart.cartId);
				return found
					? found
					: {
							cartId: cart.cartId,
							count: cart.count,
							option: cart.option,
							checked: true
						};
			});
			setCarts(serverCarts);
		}
	}, [data]);

	return <></>;
}
