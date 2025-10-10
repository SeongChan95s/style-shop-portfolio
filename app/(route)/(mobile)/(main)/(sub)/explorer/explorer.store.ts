import { Search } from '@/app/types';
import { Document } from 'mongodb';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UseExplorerStore {
	search: Search[];
	setSearch: (sentence: Search[]) => void;
	unshift: (value: Search) => void;
	slice: (value: Search) => void;
	match: (value: string) => Document;
	setMatch: (fn: (value: string) => Document) => void;
}

export const useExplorerStore = create(
	persist<UseExplorerStore>(
		set => ({
			search: [],
			setSearch: value => set(() => ({ search: value })),
			unshift: value =>
				set(state => {
					const index = state.search.findIndex(item => item._id === value._id);
					let newSearch = [...state.search];
					if (index !== -1) {
						newSearch.splice(index, 1);
					}
					newSearch = [value, ...newSearch];
					return { search: newSearch };
				}),
			slice: value =>
				set(state => {
					const index = state.search.findIndex(item => item._id === value._id);
					if (index !== -1) {
						return {
							search: [...state.search.slice(index + 1), ...state.search.slice(0, index)]
						};
					}
					return { search: state.search };
				}),
			match: (value: string) => {
				if (typeof value !== 'string' || !value) return {};
				const searchWords = value.split(' ').filter(word => word.length > 0);
				return {
					$or: searchWords.map(word => ({
						$or: [
							{ name: { $regex: word, $options: 'iu' } },
							{ brand: { $regex: word, $options: 'iu' } },
							{ keywords: { $regex: word, $options: 'iu' } }
						]
					}))
				};
			},
			setMatch: fn => set(_state => ({ match: fn }))
		}),
		{ name: 'search' }
	)
);
