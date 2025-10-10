import { create } from 'zustand';

interface UseFilterStoreState {
	filter: Record<string, string[]>;
	isOpen: boolean;
	filterGroup: Record<string, string[]>;
	selectedFilter: Record<string, string[]>;
}

interface UseFilterStoreAction {
	setFilter: (value: Record<string, string[]>) => void;
	setIsOpen: (value: boolean) => void;
	setFilterGroup: (value: Record<string, string[]>) => void;
	setSelectedFilter: (value: Record<string, string[]>) => void;
	addSelectedFilter: (value: string, groupKey: string) => void;
	removeSelectedFilter: (value: string, groupKey?: string) => void;
	toggleSelectedFilter: (value: string, groupKey: string) => void;
	resetStore: () => void;
}

const useFilterStoreInitialState: UseFilterStoreState = {
	filter: {},
	isOpen: false,
	filterGroup: {},
	selectedFilter: {}
};

export const useFilterStore = create<UseFilterStoreState & UseFilterStoreAction>(
	(set, _get) => ({
		...useFilterStoreInitialState,
		setFilter: value => set({ filter: value }),
		setIsOpen: value => set({ isOpen: value }),
		setFilterGroup: value => set({ filterGroup: value }),
		setSelectedFilter: value => set({ selectedFilter: value }),
		addSelectedFilter: (value, groupKey) =>
			set(store => {
				const newSelectedFilter = { ...store.selectedFilter };
				if (!newSelectedFilter[groupKey]) {
					newSelectedFilter[groupKey] = [];
				}
				if (!newSelectedFilter[groupKey].includes(value)) {
					newSelectedFilter[groupKey] = [...newSelectedFilter[groupKey], value];
				}
				return { selectedFilter: newSelectedFilter };
			}),
		removeSelectedFilter: (value, groupKey) =>
			set(store => {
				// groupKey가 제공되지 않으면 모든 그룹에서 해당 값을 찾아서 제거
				if (!groupKey) {
					const newSelectedFilter = { ...store.selectedFilter };
					for (const [group, values] of Object.entries(newSelectedFilter)) {
						if (values.includes(value)) {
							newSelectedFilter[group] = values.filter(item => item !== value);
							if (newSelectedFilter[group].length === 0) {
								delete newSelectedFilter[group];
							}
							break;
						}
					}
					return { selectedFilter: newSelectedFilter };
				}

				if (!store.selectedFilter[groupKey]) return store;

				const newSelectedFilter = { ...store.selectedFilter };
				newSelectedFilter[groupKey] = newSelectedFilter[groupKey].filter(
					item => item !== value
				);

				// 그룹이 비어있으면 삭제
				if (newSelectedFilter[groupKey].length === 0) {
					delete newSelectedFilter[groupKey];
				}

				return { selectedFilter: newSelectedFilter };
			}),
		toggleSelectedFilter: (value, groupKey) =>
			set(store => {
				const newSelectedFilter = { ...store.selectedFilter };
				if (!newSelectedFilter[groupKey]) {
					newSelectedFilter[groupKey] = [];
				}

				const groupFilters = newSelectedFilter[groupKey];
				const index = groupFilters.indexOf(value);

				if (index !== -1) {
					newSelectedFilter[groupKey] = groupFilters.filter(item => item !== value);
					// 그룹이 비어있으면 삭제
					if (newSelectedFilter[groupKey].length === 0) {
						delete newSelectedFilter[groupKey];
					}
				} else {
					newSelectedFilter[groupKey] = [...groupFilters, value];
				}

				return { selectedFilter: newSelectedFilter };
			}),
		resetStore: () => set(useFilterStoreInitialState)
	})
);
