import { calculatePrices } from '@/app/utils/cart';
import { Skeleton } from '../common/Skeleton';
import styles from './Calculation.module.scss';

export function CalculationSkeleton() {
	return (
		<div className={`${styles.calculation} ${styles.calculationSkeleton}`}>
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

interface CalculationProps {
	priceTags: {
		price: {
			cost: number;
			discount: number;
		};
		count: number;
	}[];
}

export default function Calculation({ priceTags }: CalculationProps) {
	const { amount, totalPrice, totalDiscount, expectedCost } = calculatePrices(priceTags);

	return (
		<ul className={styles.calculation}>
			<li>
				<span className={styles.label}>주문 상품 수</span>
				<span className={styles.amount}>{amount} 개</span>
			</li>
			<li>
				<span className={styles.label}>상품금액</span>
				<span className={styles.amount}>
					{Math.floor(totalPrice)?.toLocaleString()}원
				</span>
			</li>
			<li>
				<span className={styles.label}>할인혜택</span>
				<span className={styles.amount}>
					-{Math.floor(totalDiscount)?.toLocaleString()}원
				</span>
			</li>
			<li>
				<span className={styles.label}>배송비</span>
				<span className={styles.amount}>
					<span className={styles.tip}>전 상품 무료배송</span>0원
				</span>
			</li>
			<li>
				<span className={styles.label}>결제 금액</span>
				<span className={styles.amount}>
					{Math.floor(expectedCost)?.toLocaleString()}원
				</span>
			</li>
		</ul>
	);
}
