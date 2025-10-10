'use client';

import { useQuery } from '@tanstack/react-query';
import { getCartsWithProductByUser } from '@/app/services/cart';
import { useCartStore } from './cart.store';
import { getCheckedCarts } from '@/app/utils/cart';
import Calculation, { CalculationSkeleton } from '@/app/components/order/Calculation';
import styles from './cart.module.scss';

export default function Calculate() {
	const cartsState = useCartStore(state => state.carts);
	const { data, isPending, isError } = useQuery({
		queryFn: () => getCartsWithProductByUser(),
		queryKey: ['cart']
	});

	if (isPending || isError) return <CalculationSkeleton />;

	const carts = data.success ? data.data : [];
	const checkedCarts = getCheckedCarts(cartsState, carts);

	return (
		<section className={`sectionLayoutLg ${styles.calculate}`}>
			<Calculation priceTags={checkedCarts} />
		</section>
	);
}
