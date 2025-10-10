'use client';

import { BrandCard } from '@/app/components/brand';
import { getWishBrandsWithProductBySession } from '@/app/services/wish/getWishBrandsBySession';
import { ErrorDisplay } from '@/app/components/system';
import { Brand } from '@/app/types';
import styles from '../wish.module.scss';
import { useInViewInfiniteQuery } from '@/app/hooks/useInfiniteScroll';
import { useInfiniteQuery } from '@tanstack/react-query';

export default function BrandWishPage() {
	const limit = 2;

	const { data, error, hasNextPage, fetchNextPage } = useInfiniteQuery({
		queryFn: async ({ pageParam: skip }) =>
			getWishBrandsWithProductBySession({ skip, limit }),
		queryKey: ['wish', 'brand', 'product'],
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
	const brands = pages && pages.flatMap(page => page.data);

	if (error) {
		return <ErrorDisplay message={error.message} />;
	}

	return (
		<section className={`${styles.wishBrand}`}>
			<h3 className="hidden">위시 브랜드 목록</h3>

			<ul className={styles.brandWrap}>
				{brands ? (
					brands.map(brand => (
						<li key={brand._id}>
							<BrandCard data={brand} />
						</li>
					))
				) : (
					<></>
				)}
			</ul>
			<div ref={infiniteLoaderRef} className={styles.loader}></div>
		</section>
	);
}
