import { usePushNotificationStore } from '@/app/store';
import { urlBase64ToUint8Array } from '../convert';
import { subscribeUser } from '@/app/actions/system';
import { pushCookie } from '../cookie';

export const subscribeToPush = async (e: React.MouseEvent) => {
	e.preventDefault();
	e.stopPropagation();

	try {
		const setSubscription = (value: PushSubscription | null | undefined) =>
			usePushNotificationStore.getState().setSubscription(value);

		const registration = await navigator.serviceWorker.ready;
		const sub = await registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: urlBase64ToUint8Array(
				process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
			)
		});
		setSubscription(sub);
		const serializedSub = JSON.parse(JSON.stringify(sub));
		await subscribeUser(serializedSub);

		pushCookie('popup', 'push');
	} catch (error) {
		console.log(error);
	}
};
