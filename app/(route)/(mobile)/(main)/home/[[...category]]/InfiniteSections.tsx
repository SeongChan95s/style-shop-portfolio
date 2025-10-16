'use client';

import { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getContentsWithProducts } from '@/app/services/contents';
import { ProductNested, Magazine } from '@/app/types';
import useInfiniteScroll from '@/app/hooks/scroll/useInfiniteScroll';
import ProductSection from './ProductSection';
import MagazineSection from './MagazineSection';
import { searchProducts } from '@/app/services/explorer';
import type { GetProductsParams } from '@/app/services/explorer/searchProducts';
import { merge, omit } from 'lodash';
import styles from './home.module.scss';
import { translateCategory } from '@/app/utils/translate/translateCategory';

interface InfiniteSectionsProps {
	category?: string;
}

export default function InfiniteSections({ category }: InfiniteSectionsProps) {
	const productCategoryPipe = category
		? { match: { group: { 'category.gender': translateCategory(category) } } }
		: {};
	const magazineCategoryPipe = category
		? { match: { keywords: { $in: [translateCategory(category)] } } }
		: {};

	const sections = [
		{
			title: '베스트셀러',
			type: 'product',
			...productCategoryPipe
		},
		{
			title: '핫세일 상품',
			...merge(
				{
					match: { group: { 'price.discount': { $gt: 0 } } }
				},
				productCategoryPipe
			),
			sort: { 'price.discount': -1 },
			type: 'product'
		},
		{
			title: '매거진',
			...merge({ match: { name: '매거진' } }, magazineCategoryPipe),
			type: 'magazine'
		},
		{
			title: '신상품',
			...productCategoryPipe,
			type: 'product'
		},
		{
			title: '스타일링',
			...productCategoryPipe,
			type: 'product'
		}
	];

	const sectionWithQuery = useMemo(() => {
		return sections.map(filter => ({
			...filter,
			queryFn: () => {
				if (filter.type === 'product') {
					return searchProducts({
						...omit(filter, 'type', 'title'),
						limit: { group: 8 }
					} as GetProductsParams);
				} else if (filter.type === 'magazine') {
					return getContentsWithProducts<Magazine>({
						...omit(filter, 'type', 'title')
					});
				}
			}
		}));
	}, [category]);

	const {
		data,
		isError,
		isSuccess,
		isLoading,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage
	} = useInfiniteQuery({
		queryKey: ['product', 'magazine', category || 'all'],
		queryFn: async ({ pageParam = 0 }: { pageParam?: number }) => {
			const filter = sectionWithQuery[pageParam % sectionWithQuery.length];
			return await filter.queryFn();
		},
		initialPageParam: 0,
		getNextPageParam: (_, pages) =>
			pages.length < sectionWithQuery.length ? pages.length : undefined
	});

	const infiniteLoaderRef = useInfiniteScroll(
		fetchNextPage,
		hasNextPage && !isFetchingNextPage
	);

	if (isError) return null;

	return (
		<div className={styles.infiniteSections}>
			{isSuccess &&
				data.pages.map((page, pageIndex) => {
					const filter = sectionWithQuery[pageIndex % sectionWithQuery.length];
					const { title, type } = filter;

					if (!page || !page.success) return <></>;

					if (type === 'product') {
						const products = (page.data as ProductNested[])?.filter(p => p?._id) || [];
						if (!products.length) return null;
						return <ProductSection key={pageIndex} title={title} products={products} />;
					} else if (type === 'magazine') {
						const magazines = (page.data as Magazine[])?.filter(m => m?.title) || [];
						if (!magazines.length) return null;
						return (
							<MagazineSection key={pageIndex} title={title} magazines={magazines} />
						);
					}
				})}

			{(isLoading || isFetchingNextPage) &&
				(() => {
					const nextPageIndex = data?.pages.length || 0;
					const nextFilter = sectionWithQuery[nextPageIndex % sectionWithQuery.length];

					if (nextFilter.type === 'product') {
						return <ProductSection.Skeleton key={`skeleton-${nextPageIndex}`} />;
					} else if (nextFilter.type === 'magazine') {
						return <MagazineSection.Skeleton key={`skeleton-${nextPageIndex}`} />;
					}
					return null;
				})()}
			{hasNextPage && <div style={{ height: '1px' }} ref={infiniteLoaderRef} />}
		</div>
	);
}
