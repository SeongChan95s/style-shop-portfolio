import Calculate from './Calculate';
import CartList from './CartList';
import { Divider } from '@/app/components/common/Divider';
import PurchaseBar from './PurchaseBar';
import styles from './cart.module.scss';
import InitializeCart from './initializeCart';

export default async function CartPage() {
	return (
		<div className={`${styles.cartPage} page`}>
			<InitializeCart />
			<form id="cart">
				<CartList />
				<Divider />
				<Calculate />
				<PurchaseBar />
			</form>
		</div>
	);
}
