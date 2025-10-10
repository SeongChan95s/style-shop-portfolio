import { create } from 'zustand';

interface ServiceWorkerStore {
	isSupported: boolean;
	subscription: PushSubscription | null | undefined;
	setSubscription: (value: PushSubscription | null | undefined) => void;
}

export const usePushNotificationStore = create<ServiceWorkerStore>()(set => ({
	isSupported: false,
	subscription: undefined,
	setSubscription: value => {
		set({ subscription: value });
	}
}));
