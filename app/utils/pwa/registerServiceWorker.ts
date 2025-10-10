import { subscribeUser } from '@/app/actions/system';
import { usePushNotificationStore } from '@/app/store';

export const registerServiceWorker = async () => {
	if ('serviceWorker' in navigator && 'PushManager' in window) {
		const setSubscription = (value: PushSubscription | null | undefined) =>
			usePushNotificationStore.getState().setSubscription(value);

		const registration = await navigator.serviceWorker.register('/sw.js');
		const sub = await registration.pushManager.getSubscription();
		setSubscription(sub);
		const serializedSub = JSON.parse(JSON.stringify(sub));
		subscribeUser(serializedSub);
	}
};
