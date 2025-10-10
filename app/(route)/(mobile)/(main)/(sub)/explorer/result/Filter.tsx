'use client';

import React from 'react';
import { Chip } from '@/app/components/common/Chip';
import { IconSettingOutlined } from '@/app/components/common/Icon';
import { MySwiper } from '@/app/components/common/Swiper';
import { Button } from '@/app/components/common/Button';
import { getRedundancy } from '@/app/utils/array';
import { translateCategory } from '@/app/utils/translate/translateCategory';
import { useFilterStore } from './result.store';
import styles from './result.module.scss';

export default function Filter() {
	const filter = useFilterStore(state => state.filter);
	const selectedFilter = useFilterStore(state => state.selectedFilter);

	const allSelectedFilters = Object.values(selectedFilter).flat();

	const selectedFilterKeys =
		Object.keys(filter).filter((key: string) =>
			filter[key].some((value: string) => allSelectedFilters.includes(value))
		) ?? [];

	const keys = Object.keys(filter);

	const handleFilterGroupOpen = (value: string) => () => {
		if (filter[value]) {
			const store = useFilterStore.getState();
			store.setFilterGroup({ [value]: filter[value] });
			store.setIsOpen(true);
		}
	};

	const handleSelectedFilterOpen = () => {
		if (allSelectedFilters.length > 0) {
			const store = useFilterStore.getState();
			store.setFilterGroup({});
			store.setIsOpen(true);
		}
	};

	return (
		<nav className={styles.filter}>
			<MySwiper className={styles.filterWrap}>
				{keys.map((el, i) => (
					<Chip
						size="sm"
						variant={selectedFilterKeys.includes(el) ? 'filled' : 'depth'}
						onClick={handleFilterGroupOpen(el)}
						key={`filter_${i}`}>
						{translateCategory(el)}
					</Chip>
				))}
			</MySwiper>
			<Button
				className={`${styles.filterButton} ${allSelectedFilters.length >= 1 ? styles.on : ''} `}
				onClick={handleSelectedFilterOpen}>
				<IconSettingOutlined />
				{allSelectedFilters.length != 0 &&
					getRedundancy(Object.values(filter).flat() as string[], allSelectedFilters)}
			</Button>
		</nav>
	);
}
