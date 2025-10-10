export const isPWA = () => {
	return (
		'serviceWorker' in navigator &&
		'PushManager' in window &&
		(window.matchMedia('(display-mode: standalone)').matches ||
			window.matchMedia('(display-mode: window-controls-overlay)').matches ||
			// @ts-expect-error: iOS Safari only
			window.navigator.standalone === true)
	);
};
