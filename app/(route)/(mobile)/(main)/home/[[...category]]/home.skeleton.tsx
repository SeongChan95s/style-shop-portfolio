import { Skeleton } from '@/app/components/common/Skeleton';
import { ProductCard } from '@/app/components/product';
import styles from './home.module.scss';

export function MainVisualSkeleton() {
	return (
		<div className={styles.mainVisualSkeleton}>
			<Skeleton className={styles.visual} width="5%" />
			<Skeleton className={styles.visual} width="90%" />
			<Skeleton className={styles.visual} width="5%" />
		</div>
	);
}

export function QuickContentsSkeleton() {
	return (
		<div className={styles.quickContentsSkeleton}>
			<Skeleton variant="circle" />
			<Skeleton variant="circle" />
			<Skeleton variant="circle" />
			<Skeleton variant="circle" />
			<Skeleton variant="circle" />
			<Skeleton variant="circle" />
		</div>
	);
}

export function ProductRecommendSkeleton() {
	return (
		<div className="sectionLayoutMd inner">
			<Skeleton className="headerLayoutMd" variant="text" fontSize="2rem" />
			<div className="column4">
				<ProductCard.Skeleton className="columnItem" />
				<ProductCard.Skeleton className="columnItem" />
				<ProductCard.Skeleton className="columnItem" />
				<ProductCard.Skeleton className="columnItem" />
			</div>
		</div>
	);
}

export function MagazineStandSkeleton() {
	return (
		<div className={`${styles.magazineStand} sectionLayoutMd`}>
			<div className="inner">
				<Skeleton className="headerLayoutMd" variant="text" fontSize="2rem" />
				<div className={styles.visual}>
					<Skeleton fill />
				</div>
				<div className={styles.productWrap}>
					<ProductCard.Skeleton direction="horizontal" />
					<ProductCard.Skeleton direction="horizontal" />
				</div>
			</div>
		</div>
	);
}

export function TrendProductSkeleton() {
	return (
		<div className={`${styles.skeleton} inner`}>
			<div className="column3">
				<ProductCard.Skeleton className="columnItem" />
				<ProductCard.Skeleton className="columnItem" />
				<ProductCard.Skeleton className="columnItem" />
			</div>
			<div className="column3">
				<ProductCard.Skeleton className="columnItem" />
				<ProductCard.Skeleton className="columnItem" />
				<ProductCard.Skeleton className="columnItem" />
			</div>
		</div>
	);
}
