'use client';

import { Brand } from '@/app/types';
import { useQuery } from '@tanstack/react-query';
import { getBrandWishStatus } from '@/app/services/brand/getBrandWishStatus';
import { useSession } from '@/app/providers/SessionProvider';
import styles from './brand.module.scss';

interface BrandInfoProps {
	brand: Brand;
}

export default function BrandInfo({ brand }: BrandInfoProps) {
	const session = useSession();

	const { data: wishStatus } = useQuery({
		queryKey: ['brand-wish-status', brand._id],
		queryFn: () => getBrandWishStatus(brand._id),
		enabled: !!session
	});

	const wishCount =
		(wishStatus?.success ? wishStatus.data.wishCount : brand.wishUsers?.length) || 0;

	return (
		<div className={styles.brandInfoSection}>
			<div className={styles.stats}>
				<div className={styles.statItem}>
					<span className={styles.statLabel}>Since</span>
					<span className={styles.statValue}>{brand.since}</span>
				</div>
				<div className={styles.statItem}>
					<span className={styles.statLabel}>Country</span>
					<span className={styles.statValue}>{brand.country}</span>
				</div>
				<div className={styles.statItem}>
					<span className={styles.statLabel}>Like</span>
					<span className={styles.statValue}>{wishCount.toLocaleString()}</span>
				</div>
			</div>

			<p className={styles.desc}>{brand.desc}</p>
		</div>
	);
}
