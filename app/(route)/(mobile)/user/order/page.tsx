import { getOrdersProductsBySession } from '@/app/services/order/getOrdersProductsBySession';
import { handleFetch } from '@/app/utils';
import { cookies } from 'next/headers';
import UserOrderCard from '@/app/components/user/UserOrderCard';
import Link from 'next/link';
import { getFormatDate } from '@/app/utils/date';
import styles from './../user.module.scss';
import { translateOrderStatus } from '@/app/utils/translate/translateOrderStatus';

export default async function UserOrderPage() {
	const cookie = await cookies();
	const decodedCookie = decodeURIComponent(cookie.toString());

	const [result, error] = await handleFetch({
		queryFn: getOrdersProductsBySession(decodedCookie)
	});

	if (error) return <p>{error.message}</p>;
	if (!result.success) return <p>{result.message}</p>;
	let ordersProducts = result.data;
	ordersProducts = ordersProducts.sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1));

	return (
		<div className={styles.userOrderPage}>
			<div className="inner">
				{ordersProducts.map(orderProducts => (
					<article className={styles.userOrderCard} key={`${orderProducts._id}_card`}>
						<header className={styles.header}>
							<div className={styles.top}>
								<span className={styles.date}>
									{getFormatDate(orderProducts.timestamp, 'YY.M.D(ddd)')}
								</span>
								<Link
									href={`/order/detail/${orderProducts._id}`}
									className={styles.detailLink}>
									주문상세
								</Link>
							</div>
							<p className={styles.status}>
								{translateOrderStatus(orderProducts.status)}
							</p>
						</header>

						<UserOrderCard orderProducts={orderProducts} />
					</article>
				))}
			</div>
		</div>
	);
}
