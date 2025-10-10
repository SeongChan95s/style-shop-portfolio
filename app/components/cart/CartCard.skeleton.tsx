import { Card } from '../common/Card';
import { Skeleton } from '../common/Skeleton';
import styles from './CartCard.module.scss';

export default function CartCardSkeleton() {
	return (
		<Card
			className={`cart-card ${styles.card} ${styles.skeleton}`}
			direction="horizontal">
			<div className={styles.checkArea}>
				<Skeleton fill />
			</div>

			<div className={styles.container}>
				<div className={styles.productInfo}>
					<Card.Thumbnail className={styles.thumbnail}>
						<Skeleton fill />
					</Card.Thumbnail>

					<Card.Container className={styles.cardBody}>
						<Skeleton variant="text" count={2} />
					</Card.Container>
				</div>

				<div className={styles.cardFooter}>
					<Skeleton />
					<Skeleton variant="text" />
				</div>
			</div>
		</Card>
	);
}
