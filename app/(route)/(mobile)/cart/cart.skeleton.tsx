import { CartCardSkeleton } from '@/app/components/cart';
import { Skeleton } from '@/app/components/common/Skeleton';
import styles from './cart.module.scss';

export function CartListSkeleton() {
	return (
		<div className="inner">
			<CartCardSkeleton />
			<CartCardSkeleton />
		</div>
	);
}

export function CalculateSkeleton() {
	return (
		<div className={`${styles.calculate} ${styles.calculateSkeleton}`}>
			<ul>
				<li>
					<span className={styles.label}>주문 상품 수</span>
					<span className={styles.amount}>
						<Skeleton variant="text" />
					</span>
				</li>
				<li>
					<span className={styles.label}>상품금액</span>
					<span className={styles.amount}>
						<Skeleton variant="text" />
					</span>
				</li>
				<li>
					<span className={styles.label}>할인혜택</span>
					<span className={styles.amount}>
						<Skeleton variant="text" />
					</span>
				</li>
				<li>
					<span className={styles.label}>배송비</span>
					<span className={styles.amount}>
						<span className={styles.tip}>전 상품 무료배송</span>0원
					</span>
				</li>
				<li>
					<span className={styles.label}>결제 예상 금액</span>
					<span className={styles.amount}>
						<Skeleton variant="text" />
					</span>
				</li>
			</ul>
		</div>
	);
}
