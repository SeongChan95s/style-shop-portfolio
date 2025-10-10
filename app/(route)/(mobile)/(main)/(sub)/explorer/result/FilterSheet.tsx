'use client';

import { BottomSheet } from '@/app/components/common/BottomSheet';
import { Checkbox } from '@/app/components/common/Checkbox';
import { Button } from '@/app/components/common/Button';
import Chip from '@/app/components/common/Chip/Chip';
import { IconClose } from '@/app/components/common/Icon';
import styles from './result.module.scss';
import { useFilterStore } from './result.store';

function CheckboxGroup() {
	const filterGroup = useFilterStore(state => state.filterGroup);
	const selectedFilter = useFilterStore(state => state.selectedFilter);
	const allSelectedFilters = Object.values(selectedFilter).flat();
	const [groupKey, groupValues] = Object.entries(filterGroup)[0] || ['', []];

	const handleAllCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
		const store = useFilterStore.getState();
		if (e.target.checked) {
			groupValues.forEach(filter => {
				store.addSelectedFilter(filter, groupKey);
			});
		} else {
			groupValues.forEach(filter => {
				store.removeSelectedFilter(filter, groupKey);
			});
		}
	};

	const handleCheck = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
		const store = useFilterStore.getState();
		if (e.target.checked) {
			store.addSelectedFilter(name, groupKey);
		} else {
			store.removeSelectedFilter(name, groupKey);
		}
	};

	return (
		<ul className={styles.checkboxWrap}>
			<Checkbox
				name="all"
				value="all"
				checked={groupValues.every(value => allSelectedFilters.includes(value))}
				onChange={handleAllCheckbox}>
				전체
			</Checkbox>

			{groupValues.map(name => (
				<Checkbox
					name={name}
					value={name}
					key={name}
					checked={allSelectedFilters.includes(name)}
					onChange={handleCheck(name)}>
					{name}
				</Checkbox>
			))}
		</ul>
	);
}

export default function FilterSheet() {
	const isOpen = useFilterStore(state => state.isOpen);
	const filterGroup = useFilterStore(state => state.filterGroup);
	const selectedFilter = useFilterStore(state => state.selectedFilter);

	const allSelectedFilters = Object.values(selectedFilter).flat();

	const handleUnselect = (name: string) => () => {
		const store = useFilterStore.getState();
		store.removeSelectedFilter(name);

		if (Object.values(store.selectedFilter).flat().length == 0) {
			store.setIsOpen(false);
		}
	};

	const handleSearchByFilter = () => {
		useFilterStore.getState().setIsOpen(false);
		// router.push(`/explorer/result/product?search=${}`)
	};

	return (
		<BottomSheet
			className={styles.filterSheet}
			state={isOpen ? 'expanded' : 'closed'}
			onChange={open => useFilterStore.getState().setIsOpen(open == 'expanded')}
			overlay>
			{Object.keys(filterGroup).length >= 1 ? (
				<CheckboxGroup />
			) : (
				<ul className={styles.selectedWrap}>
					{allSelectedFilters.length >= 1 &&
						allSelectedFilters.map((el, i) => (
							<li key={`selected_${i}`}>
								<Chip variant="outlined">
									{el} <IconClose size="sm" onClick={handleUnselect(el)} />
								</Chip>
							</li>
						))}
				</ul>
			)}
			{allSelectedFilters.length >= 1 ? (
				<Button className={styles.confirmButton} fill onClick={handleSearchByFilter}>
					검색하기
				</Button>
			) : (
				<Button
					className={styles.confirmButton}
					variant="outlined"
					fill
					onClick={() => useFilterStore.getState().setIsOpen(false)}>
					닫기
				</Button>
			)}
		</BottomSheet>
	);
}
