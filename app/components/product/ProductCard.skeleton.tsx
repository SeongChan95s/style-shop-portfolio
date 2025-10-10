import { Card } from '../common/Card';
import Skeleton from '../common/Skeleton/Skeleton';
import styles from './ProductCard.module.scss';

interface ProductCardSkeletonProps {
	className?: string;
	direction?: 'vertical' | 'horizontal';
	size?: 'sm' | 'md';
	ratio?: { width: number; height: number };
}

export default function ProductCardSkeleton({
	className = '',
	size = 'md',
	ratio = { width: 1, height: 1 },
	direction = 'vertical'
}: ProductCardSkeletonProps) {
	return (
		<Card
			direction={direction}
			className={`${styles.skeleton} ${styles[size]} ${styles[direction]} ${className}`}>
			<Card.Thumbnail className={styles.thumbnail} ratio={ratio}>
				<Skeleton fill />
			</Card.Thumbnail>
			<Card.Container className={styles.container}>
				<div className={styles.body}>
					<Skeleton variant="text" className={styles.text} count={2} />
				</div>
			</Card.Container>
		</Card>
	);
}
