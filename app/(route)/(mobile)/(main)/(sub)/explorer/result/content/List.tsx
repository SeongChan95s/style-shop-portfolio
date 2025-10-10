'use client';

import { useFilterStore } from '../result.store';
import SearchContentList from '@/app/components/explorer/SearchContentList';
import styles from './../result.module.scss';

interface ListProps {
	search: string;
}

export default function List({ search }: ListProps) {
	const selectedFilter = useFilterStore(state => state.selectedFilter);

	return (
		<section className={`${styles.list} sectionLayoutMd`}>
			<h3 className="hidden">컨텐츠 목록</h3>
			<div className={styles.productWrap}>
				<SearchContentList search={search} selectedFilter={selectedFilter} />
			</div>
		</section>
	);
}
