'use client';

import { MySwiper } from '@/app/components/common/Swiper';
import { ProductCard } from '@/app/components/product';
import { useSuspenseQuery } from '@tanstack/react-query';
import { searchProducts } from '@/app/services/explorer';
import styles from './home.module.scss';

interface ProductRecommendProps {
	query?: object;
}

export default function ProductRecommend({ query }: ProductRecommendProps) {
	const { data: response } = useSuspenseQuery({
		queryFn: () =>
			searchProducts({
				limit: {
					group: 5
				},
				...query
			}),

		queryKey: ['product', 'recommend', query]
	});

	const products = response.success ? response.data : [];

	return (
		<section className={`sectionLayoutMd ${styles.productRecommend}`}>
			<header className={`headerLayoutMd ${styles.sectionHeader}`}>
				<div className="inner">
					<h3>추천 상품</h3>
				</div>
			</header>
			<MySwiper className={styles.swiper} variant="card" slidesPerView={3} inner>
				{response.success &&
					products.map(product => {
						return (
							<ProductCard
								product={product}
								key={product._id.toString()}
								imageSizes="20vw"
							/>
						);
					})}
			</MySwiper>
		</section>
	);
}
