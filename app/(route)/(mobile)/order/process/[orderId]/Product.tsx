'use client';

import { useQuery } from '@tanstack/react-query';
import { OrderProductCard } from '@/app/components/order';
import { getOrderProducts } from '@/app/services/order/getOrderProducts';
import { useOptionSheetStore } from './OptionSheet';
import styles from './../../order.module.scss';

interface ProductProps {
	orderId: string;
}

export default function Product({ orderId }: ProductProps) {
	const { data, isError, isPending } = useQuery({
		queryFn: async () => await getOrderProducts(orderId),
		queryKey: ['order', 'product', orderId]
	});

	if (isError) <></>;
	if (isPending) <></>;
	if (!data?.success) return <></>;

	const products = data.data;

	return (
		<section className={`sectionLayoutLg ${styles.product}`}>
			<div className="inner">
				<header className="headerLayoutMd">
					<h3>주문 상품 {products.reduce((acc, cur) => acc + cur.count, 0)}개</h3>
				</header>
				<div className={styles.contents}>
					<ul className={styles.list}>
						{products &&
							products.map((product) => (
								<OrderProductCard
									product={product}
									key={`${product._id}_card`}
									onClickOptionButton={() => {
										if (useOptionSheetStore.getState().state != 'expanded') {
											useOptionSheetStore.getState().setProductGroupId(product._id);
											useOptionSheetStore.getState().setState('expanded');
										} else {
											useOptionSheetStore.getState().setState('closed');
										}
									}}
								/>
							))}
					</ul>
				</div>
			</div>
		</section>
	);
}
