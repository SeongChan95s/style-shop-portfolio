'use server';

import webpush from 'web-push';

webpush.setVapidDetails(
	'https://style-shop-portfolio.vercel.app',
	process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
	process.env.VAPID_PRIVATE_KEY!
);

let subscription: PushSubscription | null = null;

export async function subscribeUser(sub: PushSubscription) {
	subscription = sub;
	return { success: true };
}

export async function unsubscribeUser() {
	subscription = null;
	return { success: true };
}

interface SendNotification {
	title: string;
	body: string;
}

export async function sendNotification({ title, body }: SendNotification) {
	if (!subscription) throw new Error('No subscription');

	try {
		await webpush.sendNotification(
			subscription as unknown as webpush.PushSubscription,
			JSON.stringify({
				title,
				body
			})
		);
		return { success: true };
	} catch (error) {
		console.error('Error sending push notification:', error);
		return { success: false, error: 'Failed to send notification' };
	}
}

export async function sendNotificationToUser({
	subscription: userSubscription,
	title,
	body,
	url
}: {
	subscription: PushSubscription;
	title: string;
	body: string;
	url?: string;
}) {
	try {
		await webpush.sendNotification(
			userSubscription as unknown as webpush.PushSubscription,
			JSON.stringify({
				title,
				body,
				url
			})
		);
		return { success: true };
	} catch (error) {
		console.error('Error sending push notification:', error);
		return { success: false, error: 'Failed to send notification' };
	}
}
