'use client';

import SearchProductList from '@/app/components/explorer/SearchProductList';
import { useFilterStore } from '../result.store';
import styles from './product.module.scss';

interface ListProps {
	search: string;
}

export default function List({ search }: ListProps) {
	const selectedFilter = useFilterStore(state => state.selectedFilter);

	return (
		<section className={`${styles.list} sectionLayoutMd`}>
			<header className="headerLayoutMd">
				<h3 className="hidden">상품 목록</h3>
			</header>
			<div className={styles.productWrap}>
				<SearchProductList search={search} selectedFilter={selectedFilter} />
			</div>
		</section>
	);
}
