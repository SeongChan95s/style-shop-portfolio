import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface UseGlobalStore {
	layoutWidth: number;
	setLayoutWidth: (value: number) => void;
}

export const useGlobalStore = create<UseGlobalStore>()(set => ({
	layoutWidth: 0,
	setLayoutWidth: value => {
		set({ layoutWidth: value });
	}
}));

interface UseSystemAlertStore {
	alerts: string[];
	push: (value: string) => void;
	shift: () => void;
	slice: (value: string) => void;
}

export const useSystemAlertStore = create<UseSystemAlertStore>()(
	subscribeWithSelector(set => ({
		alerts: [''],
		push: value => {
			set(store => ({ alerts: [...store.alerts, value] }));
		},
		shift: () => {
			set(store => ({ alerts: store.alerts.slice(1) }));
		},
		slice: value => {
			set(store => {
				const index = store.alerts.indexOf(value);
				if (index !== -1) {
					return {
						alerts: [...store.alerts.slice(0, index), ...store.alerts.slice(index + 1)]
					};
				}
				return store;
			});
		}
	}))
);
