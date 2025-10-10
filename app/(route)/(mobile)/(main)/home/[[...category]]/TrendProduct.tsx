'use client';

import { MySwiper } from '@/app/components/common/Swiper';
import { ProductCard } from '@/app/components/product';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getProductsByView } from '@/app/services/product/getProductsByView';
import Chip from '@/app/components/common/Chip/Chip';
import { TrendProductSkeleton } from './home.skeleton';
import { HTTPError } from '@/app/services/HTTPError';
import styles from './home.module.scss';

interface TrendProductProps {
	query?: object;
}

export default function TrendProduct({ query }: TrendProductProps) {
	const [period, setPeriod] = useState(0.5);
	const {
		data: products,
		isError,
		isPending,
		isSuccess
	} = useQuery({
		queryFn: () =>
			getProductsByView({
				period,
				sort: { totalView: -1 },
				limit: { total: 10 },
				...query
			}),
		queryKey: ['trend-product', period, query],
		select: data => {
			if (!data.success) throw new HTTPError(data.message);
			return data.data;
		}
	});

	const chipVariant = (dataKey: number) => {
		if (period == dataKey) {
			return 'filled';
		} else {
			return 'depth';
		}
	};

	return (
		<section className={`sectionLayoutMd ${styles.trendProduct}`}>
			<header className={`headerLayoutMd ${styles.sectionHeader}`}>
				<div className="inner">
					<h3 className="headerMbSm">트렌드</h3>
					<div className={styles.tabsPane}>
						<Chip
							variant={chipVariant(0.5)}
							onClick={() => setPeriod(0.5)}
							data-key="0.5">
							실시간
						</Chip>
						<Chip variant={chipVariant(1)} onClick={() => setPeriod(1)} data-key="1">
							일간
						</Chip>
						<Chip variant={chipVariant(7)} onClick={() => setPeriod(7)} data-key="7">
							주간
						</Chip>
						<Chip variant={chipVariant(30)} onClick={() => setPeriod(30)} data-key="30">
							월간
						</Chip>
					</div>
				</div>
			</header>

			{(isPending || isError) && <TrendProductSkeleton />}

			{isSuccess && (
				<MySwiper className={styles.swiper} slidesPerView={3} variant="grid" inner>
					{products?.map((product, i) => {
						return <ProductCard product={product} imageSizes="30vw" size="md" key={i} />;
					})}
				</MySwiper>
			)}
		</section>
	);
}
