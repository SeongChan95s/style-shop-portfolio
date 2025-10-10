'use client';

import { SubmitBar } from '@/app/components/global/AppBar';
import { getCartsWithProductByUser } from '@/app/services/cart';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { cartAction } from '@/app/actions/cart/cartAction';
import { useCartStore } from './cart.store';
import { Cart } from '@/app/types';
import { Skeleton } from '@/app/components/common/Skeleton';
import { useActionState, useEffect, useRef, startTransition } from 'react';
import { useSystemAlertStore } from '@/app/store';
import { useRouter } from 'next/navigation';
import { getCheckedCarts, calculatePrices } from '@/app/utils/cart';
import styles from './cart.module.scss';

export default function PurchaseBar() {
	const countRef = useRef(0);
	const router = useRouter();
	const [actionState, action] = useActionState(cartAction, {
		success: false,
		orderId: null,
		message: ''
	} as const);

	const { data, isPending, isError } = useQuery({
		queryFn: () => getCartsWithProductByUser(),
		queryKey: ['cart']
	});
	const cartsState = useCartStore(state => state.carts);

	const carts = data?.success ? data.data : [];
	const checkedCarts = getCheckedCarts(cartsState, carts);
	const { amount, totalDiscount, expectedCost } = calculatePrices(checkedCarts);
	const isDisabled = checkedCarts.length === 0;
	const queryClient = useQueryClient();

	useEffect(() => {
		// 주문 변경할지 체크
		if (actionState.orderId && 'needConfirm' in actionState && actionState.needConfirm) {
			const userChoice = window.confirm(actionState.message);
			const formData = new FormData();

			checkedCarts.forEach((cart: Cart) => {
				formData.append(cart.cartId, cart.cartId);
			});
			formData.append('confirmed', userChoice ? 'yes' : 'no');

			startTransition(() => {
				action(formData);
			});
			countRef.current = 1;
			return;
		}

		// 결과 메세지
		if (countRef.current === 1) {
			useSystemAlertStore.getState().push(actionState.message);
		}
		// 성공 시 리다이렉트
		if (actionState.success) {
			queryClient.invalidateQueries({ queryKey: ['order'] });
			router.push(`/order/process/${actionState.orderId}`);
		}
		countRef.current = 1;
	}, [actionState]);

	if (isPending || isError) return <Skeleton />;

	return (
		<SubmitBar
			className={styles.purchaseBar}
			form="cart"
			formAction={action}
			label={
				isDisabled ? (
					<span>상품을 선택해주세요</span>
				) : (
					<>
						<span className={styles.discount}>
							{Math.floor(totalDiscount).toLocaleString()}
						</span>
						<span>
							{Math.floor(expectedCost).toLocaleString()}원 구매하기 ({amount}개)
						</span>
					</>
				)
			}
			disabled={isDisabled}
		/>
	);
}
