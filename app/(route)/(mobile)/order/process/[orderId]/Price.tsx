'use client';

import Calculation, { CalculationSkeleton } from '@/app/components/order/Calculation';
import { getOrderProducts } from '@/app/services/order/getOrderProducts';
import { calculatePrices } from '@/app/utils/cart';
import { useQuery } from '@tanstack/react-query';

interface PriceProps {
	orderId: string;
}

export default function Price({ orderId }: PriceProps) {
	const { data, isError, isPending } = useQuery({
		queryFn: async () => await getOrderProducts(orderId),
		queryKey: ['order', 'product', orderId]
	});

	if (isError) return <></>;
	if (isPending)
		return (
			<div className="inner">
				<CalculationSkeleton />
			</div>
		);

	const priceTags = data.data.flatMap(product => ({
		price: { ...product.price },
		count: product.count
	}));
	const { totalPrice, totalDiscount, expectedCost } = calculatePrices(priceTags);

	return (
		<section className="sectionLayoutLg">
			<div className="inner">
				<Calculation priceTags={priceTags} />
				<input type="hidden" name="payment.price" value={Math.floor(totalPrice)} />
				<input type="hidden" name="payment.discount" value={Math.floor(totalDiscount)} />
				<input type="hidden" name="payment.total" value={Math.floor(expectedCost)} />
			</div>
		</section>
	);
}
