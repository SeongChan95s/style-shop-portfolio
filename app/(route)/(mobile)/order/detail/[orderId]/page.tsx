import { handleFetch } from '@/app/utils';
import { getDecodedServerCookie } from '@/app/utils/getServerCookie';
import { getOrderProductsByOrderId } from '@/app/services/order/getOrderProductsByOrderId';
import { getFormatDate } from '@/app/utils/date';
import UserOrderCard from '@/app/components/user/UserOrderCard';
import Calculation from '@/app/components/order/Calculation';
import DeleteOrderButton from './DeleteOrderButton';
import styles from './../../order.module.scss';

export default async function OrderDetailPage({
	params
}: {
	params: Promise<{ orderId: string }>;
}) {
	const { orderId } = await params;

	const decodedCookie = await getDecodedServerCookie();

	const [result, error] = await handleFetch({
		queryFn: getOrderProductsByOrderId(orderId, decodedCookie)
	});

	if (error) return <p>{error.message}</p>;
	if (!result.success) return <p>{result.message}</p>;
	const orderProducts = result.data;

	const priceTags = orderProducts.products.map(product => ({
		price: { cost: product.price.cost, discount: product.price.discount },
		count: product.count
	}));

	return (
		<section className={`${styles.orderDetailPage} sectionLayoutLg`}>
			<h3 className="hidden">주문 상세 목록</h3>
			<div className={`${styles.wrap} inner`}>
				<ul>
					<li>
						<p className={styles.date}>
							{getFormatDate(orderProducts.timestamp, 'YY.MM.DD(ddd)')}
						</p>
						<p className={styles.id}>주문번호 {orderProducts._id.toString()}</p>
					</li>

					<li>
						<div className={styles.name}>
							<p>{orderProducts.address.name}</p>
						</div>
						<p className={styles.address}>
							{`(${orderProducts.address.post.code}) ${orderProducts.address.post.road}
								 ${orderProducts.address.post.detail}`}
						</p>
						<p className={styles.tel}>{orderProducts.address.tel}</p>
					</li>

					<li>
						<h4>
							주문 상품 {orderProducts.products.reduce((acc, cur) => acc + cur.count, 0)}
							개
						</h4>
						<UserOrderCard orderProducts={orderProducts} />
					</li>
					<li>
						<Calculation priceTags={priceTags} />
					</li>
				</ul>

				<DeleteOrderButton orderId={orderId} />
			</div>
		</section>
	);
}
