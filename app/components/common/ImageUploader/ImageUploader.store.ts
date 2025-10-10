import { create } from 'zustand';

interface UseImageUploaderStore {
	gallery: string[];
	setGallery: (values: string[]) => void;
}

export const useImageUploaderStore = create<UseImageUploaderStore>(set => ({
	gallery: [],
	setGallery: value => set({ gallery: value })
}));
