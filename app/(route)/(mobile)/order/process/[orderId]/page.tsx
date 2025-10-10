import Payment from './Payment';
import Product from './Product';
import Delivery from './Delivery';
import { Divider } from '@/app/components/common/Divider';
import { AsyncFetchBoundary } from '@/app/components/system';
import styles from './../../order.module.scss';
import Price from './Price';
import OptionSheet from './OptionSheet';
import Purchase from './Purchase';

export default async function OrderProcessPage({
	params
}: {
	params: Promise<{ orderId: string }>;
}) {
	const { orderId } = await params;

	return (
		<div className={styles.processPage}>
			<form id="orderForm">
				<input type="hidden" name="orderId" value={orderId} />
				<Delivery orderId={orderId} />
				<Divider inner />
				<AsyncFetchBoundary isClient>
					<Product orderId={orderId} />
				</AsyncFetchBoundary>
				<Divider inner />
				<Payment />
				<Divider inner />
				<Price orderId={orderId} />
			</form>
			<OptionSheet orderId={orderId} />
			<Purchase orderId={orderId} />
		</div>
	);
}
