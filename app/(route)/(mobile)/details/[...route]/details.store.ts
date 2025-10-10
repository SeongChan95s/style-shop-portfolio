import { create } from 'zustand';

interface DetailsStore {
	index: number;
	setIndex: (value: number) => void;
}

export const useDetailsStore = create<DetailsStore>(set => ({
	index: 0,
	setIndex: value => set({ index: value })
}));
