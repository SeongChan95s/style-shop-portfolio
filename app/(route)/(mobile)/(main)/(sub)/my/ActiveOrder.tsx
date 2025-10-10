'use client';

import { useQuery } from '@tanstack/react-query';
import { getOrdersProductsBySession } from '@/app/services/order/getOrdersProductsBySession';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './my.module.scss';
import { translateOrderStatus } from '@/app/utils/translate/translateOrderStatus';
import { Card } from '@/app/components/common/Card';

export default function ActiveOrder() {
	const router = useRouter();

	const { data, isLoading } = useQuery({
		queryKey: ['order', 'session'],
		queryFn: () => getOrdersProductsBySession()
	});

	if (isLoading || !data?.success) return null;

	const activeOrders = data.data
		.filter(order => ['receive', 'processing', 'shipped'].includes(order.status))
		.sort((a, b) => b.timestamp - a.timestamp);

	if (activeOrders.length === 0) return null;

	return (
		<section className={styles.activeOrder}>
			<div className="inner">
				<header className="headerLayoutSm">
					<h4>최근 주문 현황</h4>
				</header>
				<div>
					{activeOrders.map(order =>
						order.products.map(product => {
							const firstItem = product.items[0];

							return (
								<Card
									key={`${order._id.toString()}_${product._id.toString()}`}
									className={styles.orderCard}
									onClick={() => router.push(`/order/detail/${order._id.toString()}`)}>
									<Card.Thumbnail className={styles.thumbnail}>
										<Image
											src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${firstItem.images?.[0]}`}
											alt={product.name}
											sizes="86px"
											fill
										/>
									</Card.Thumbnail>
									<Card.Container className={styles.container}>
										<p className={styles.status}>{translateOrderStatus(order.status)}</p>
										<p className={styles.brand}>{product.brand}</p>
										<h5 className={styles.name}>{product.name}</h5>
										<p className={styles.option}>
											<span>{product.items[0].option.color}</span>
											<span>{product.items[0].option.size}</span>
											<span> · </span>
											<span>{product.count} 개</span>
										</p>
									</Card.Container>
								</Card>
							);
						})
					)}
				</div>
			</div>
		</section>
	);
}
