'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useRef, useEffect, useCallback } from 'react';
import { ProductCard } from '@/app/components/product';
import { searchProducts } from '@/app/services/explorer';
import styles from './SearchProductList.module.scss';

interface SearchProductListProps {
	search?: string;
	selectedFilter?: Record<string, string[]>;
	match?: {
		group?: Record<string, unknown>;
		item?: Record<string, unknown>;
	};
}

export default function SearchProductList({
	search,
	selectedFilter,
	match
}: SearchProductListProps) {
	const limit = { item: 4 };

	const createMatchFilter = useCallback(() => {
		let filterMatch = {};
		let finalMatch = match || {};

		if (selectedFilter) {
			const activeGroups = Object.entries(selectedFilter).filter(
				([_, values]) => values.length > 0
			);

			if (activeGroups.length > 0) {
				if (activeGroups.length === 1) {
					const [_, values] = activeGroups[0];
					filterMatch = { group: { keywords: { $in: values } } };
				} else {
					const andConditions = activeGroups.map(([_, values]) => ({
						keywords: { $in: values }
					}));
					filterMatch = { group: { $and: andConditions } };
				}
			}
		}

		if (Object.keys(filterMatch).length > 0) {
			finalMatch = {
				...finalMatch,
				...filterMatch
			};
		}

		return Object.keys(finalMatch).length > 0 ? finalMatch : undefined;
	}, [match, selectedFilter]);

	const {
		data,
		isError,
		isLoading,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage
	} = useInfiniteQuery({
		queryFn: async ({ pageParam: skip }) =>
			await searchProducts({
				search,
				match: createMatchFilter(),
				limit,
				skip
			}),
		queryKey: ['search', 'products', search, limit, createMatchFilter()],
		initialPageParam: 0,
		getNextPageParam: (lastPage, pages) => {
			if (lastPage.success && lastPage.data.length < limit.item) {
				return undefined;
			}
			return pages.length * limit.item;
		}
	});

	const pages = data?.pages.filter(page => page.success);
	const products = pages && pages.flatMap(page => page.data);

	// 색상 필터에 따른 아이템 정렬
	if (products) {
		products.map(product =>
			product.items.sort((a, _) => {
				if (!selectedFilter?.color?.length) return 0;
				if (selectedFilter.color.includes(a.option.color)) return -1;
				return 0;
			})
		);
	}

	const infiniteLoaderRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const target = infiniteLoaderRef.current;

		const observer = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
					fetchNextPage();
				}
			});
		});

		if (target) {
			observer.observe(target);
		}

		return () => {
			if (target) observer.unobserve(target);
		};
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

	if (isError) return <></>;

	return (
		<div className={styles.searchProductList}>
			<div className={styles.grid}>
				{products?.map(product => (
					<ProductCard key={product._id} product={product} shape="rect" />
				))}

				{(isLoading || isFetchingNextPage) && (
					<>
						<ProductCard.Skeleton />
						<ProductCard.Skeleton />
						<ProductCard.Skeleton />
						<ProductCard.Skeleton />
					</>
				)}
			</div>

			{hasNextPage && (
				<div className={styles.dataLoadObserver} ref={infiniteLoaderRef}></div>
			)}
		</div>
	);
}
