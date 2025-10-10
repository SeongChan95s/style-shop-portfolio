import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface UseFloatComponentStore {
	component: {
		adminSideBar: boolean;
	};
	setComponent: {
		setAdminSideBar: (value: boolean) => void;
	};
}

export const useFloatComponentStore = create(
	immer<UseFloatComponentStore>(set => ({
		component: {
			adminSideBar: false
		},
		setComponent: {
			setAdminSideBar: value => {
				set(store => {
					store.component.adminSideBar = value;
				});
			}
		}
	}))
);
