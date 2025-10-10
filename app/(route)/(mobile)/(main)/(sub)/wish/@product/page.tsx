'use client';

import { ProductCard } from '@/app/components/product';
import { getWishesWithProductsByUser } from '@/app/services/wish';
import { ErrorDisplay } from '@/app/components/system';
import { ProductNested } from '@/app/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInViewInfiniteQuery } from '@/app/hooks/useInfiniteScroll';
import styles from '../wish.module.scss';

export default function ProductWishPage() {
	const limit = 4;

	const { data, error, hasNextPage, fetchNextPage } = useInfiniteQuery({
		queryFn: async ({ pageParam: skip }) =>
			await getWishesWithProductsByUser({
				skip,
				limit
			}),
		queryKey: ['wish', 'product'],
		initialPageParam: 0,
		getNextPageParam: (lastPage, pages) => {
			if (lastPage.success && lastPage.data.length < limit) {
				return undefined;
			}
			return pages.length * limit;
		}
	});

	const infiniteLoaderRef = useInViewInfiniteQuery({
		hasNextPage,
		fetchNextPage
	});

	const pages = data?.pages.filter(page => page.success);
	const products = pages && pages.flatMap(page => page.data);

	if (error) {
		return <ErrorDisplay message={error.message} />;
	}

	return (
		<section className={`${styles.wishProduct}`}>
			<div className="inner">
				<h3 className="hidden">위시 상품 목록</h3>

				<ul className={styles.productWrap}>
					{products &&
						products.map((product: ProductNested, i: number) =>
							product ? (
								<li key={i}>
									<ProductCard product={product} />
								</li>
							) : null
						)}
				</ul>
			</div>
			<div ref={infiniteLoaderRef} className={styles.loader}></div>
		</section>
	);
}
