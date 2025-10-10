import { Skeleton } from '@/app/components/common/Skeleton';
import styles from './details.module.scss';

export function ProductVisualSkeleton() {
	return (
		<div className={styles.productVisual}>
			<Skeleton fill />
		</div>
	);
}

export function BrandSkeleton() {
	return (
		<div className={`${styles.brandSkeleton} inner`}>
			<Skeleton variant="text" width="20%" />
			<Skeleton variant="text" width="10%" />
		</div>
	);
}

export function OverviewSkeleton() {
	return (
		<section className={`${styles.overviewSkeleton} inner`}>
			<div className={styles.content}>
				<Skeleton variant="text" width="30%" />
				<Skeleton variant="text" width="60%" />
				<Skeleton variant="text" width="80%" />
				<Skeleton variant="text" width="40%" />
			</div>

			<div className={styles.info}>
				<Skeleton variant="text" width="35%" />
				<Skeleton variant="text" width="40%" />
				<Skeleton variant="text" width="30%" />
				<Skeleton variant="text" width="60%" />
				<Skeleton variant="text" width="35%" />
				<Skeleton variant="text" width="40%" />
				<Skeleton variant="text" width="30%" />
				<Skeleton variant="text" width="60%" />
			</div>
		</section>
	);
}

export function MainDescriptionSkeleton() {
	return (
		<section className={`${styles.mainDescription} sectionLayoutLg`}>
			<div className="inner">
				<header className="headerLayoutLg">
					<Skeleton variant="text" width="25%" />
				</header>
				<Skeleton fill height="400px" />
			</div>
		</section>
	);
}

export function ReviewSkeleton() {
	return (
		<section className="sectionLayoutMd">
			<header className="headerLayoutMd inner">
				<Skeleton variant="text" width="15%" />
			</header>
			<div className="inner">
				{Array.from({ length: 3 }).map((_, index) => (
					<div key={index} className={styles.skeletonReviewItem}>
						<div className={styles.skeletonReviewHeader}>
							<Skeleton variant="circle" width="3.2rem" height="3.2rem" />
							<Skeleton variant="text" width="40%" />
						</div>
						<Skeleton variant="text" width="90%" />
					</div>
				))}
			</div>
		</section>
	);
}
