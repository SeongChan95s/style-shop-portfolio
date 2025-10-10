'use client';

import { Checkbox } from '@/app/components/common/Checkbox';
import { useMemo } from 'react';
import { useCartStore } from './cart.store';
import { useQuery } from '@tanstack/react-query';
import { getCartsWithProductByUser } from '@/app/services/cart';
import { CartCard } from '@/app/components/cart';
import styles from './cart.module.scss';
import { CartListSkeleton } from './cart.skeleton';
import { Cart } from '@/app/types';

function FullCheckbox() {
	const carts = useCartStore(state => state.carts);

	const handleCheckAll = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) useCartStore.getState().checkAll();
		if (!e.target.checked) useCartStore.getState().clearCheck();
	};

	const isCheckedAll = useMemo(
		() => carts.length > 0 && carts.every(cart => cart.checked == true),
		[carts]
	);

	return (
		<Checkbox
			className={styles.selectAllCheckbox}
			onChange={handleCheckAll}
			checked={isCheckedAll}>
			전체 선택
		</Checkbox>
	);
}

export default function CartList() {
	const { data, isPending, isError } = useQuery({
		queryFn: () => getCartsWithProductByUser(),
		queryKey: ['cart']
	});

	if (isPending || isError) return <CartListSkeleton />;

	const carts = data.success ? data.data : [];

	return (
		<section className={`${styles.cartList} sectionLayoutSm`}>
			<h3 className={`${styles.title} hidden`}>카트 목록</h3>

			<FullCheckbox />

			{carts.length >= 1 && (
				<ul className={styles.cartWrap}>
					{carts.map((cart: Cart, i: number) => (
						<li key={i}>
							<CartCard cart={cart} />
						</li>
					))}
				</ul>
			)}
			{carts.length == 0 && <p>장바구니가 비었습니다.</p>}
		</section>
	);
}
