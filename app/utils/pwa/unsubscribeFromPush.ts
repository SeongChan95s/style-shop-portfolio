import { unsubscribeUser } from '@/app/actions/system';
import { usePushNotificationStore } from '@/app/store';

export const unsubscribeFromPush = async () => {
	const subscription = usePushNotificationStore.getState().subscription;
	const setSubscription = (value: PushSubscription | null | undefined) =>
		usePushNotificationStore.getState().setSubscription(value);

	await subscription?.unsubscribe();
	setSubscription(null);
	await unsubscribeUser();
};
