self.addEventListener('push', function (event) {
	if (event.data) {
		const data = event.data.json();
		const options = {
			body: data.body,
			vibrate: [100, 50, 100],
			data: {
				url: data.url ?? 'https://style-shop-portfolio.vercel.app'
			}
		};
		event.waitUntil(self.registration.showNotification(data.title, options));
	}
});

self.addEventListener('notificationclick', function (event) {
	event.notification.close();
	event.waitUntil(clients.openWindow(event.notification.data.url));
});
