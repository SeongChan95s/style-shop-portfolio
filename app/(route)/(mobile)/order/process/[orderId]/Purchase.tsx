'use client';

import { submitOrderAction } from '@/app/actions/order/submitOrderAction';
import { SubmitBar } from '@/app/components/global/AppBar';
import { useQuery } from '@tanstack/react-query';
import { useActionState, useEffect, useRef } from 'react';
import styles from './../../order.module.scss';
import { calculatePrices } from '@/app/utils/cart';
import { getOrderProducts } from '@/app/services/order/getOrderProducts';
import { useRouter } from 'next/navigation';
import { useSystemAlertStore } from '@/app/store';

interface PurchaseProps {
	orderId: string;
}

export default function Purchase({ orderId }: PurchaseProps) {
	const router = useRouter();
	const count = useRef(0);
	const [actionState, action] = useActionState(submitOrderAction, {
		success: false,
		message: ''
	});

	const { data, isError, isPending } = useQuery({
		queryFn: async () => await getOrderProducts(orderId),
		queryKey: ['order', 'product', orderId]
	});

	useEffect(() => {
		if (count.current == 1) {
			useSystemAlertStore.getState().push(actionState.message);
			if (actionState.success) {
				router.push('/my');
			}
		}
		count.current = 1;
	}, [actionState]);

	if (isPending || isError) return <></>;

	const priceTags = data.data.flatMap(product => ({
		price: { ...product.price },
		count: product.count
	}));

	const { amount, totalDiscount, expectedCost } = calculatePrices(priceTags);

	return (
		<SubmitBar
			className={styles.purchase}
			label={
				<>
					<span className={styles.discount}>
						{Math.floor(totalDiscount).toLocaleString()}
					</span>
					<span>
						{Math.floor(expectedCost).toLocaleString()}원 구매하기 ({amount}개)
					</span>
				</>
			}
			form="orderForm"
			formAction={action}
		/>
	);
}
