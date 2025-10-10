export const isWebPush = () => {
	if ('serviceWorker' in navigator && 'PushManager' in window) return true;
	return false;
};
