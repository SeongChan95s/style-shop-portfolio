export const checkIsApp = () => {
	// iOS Safari standalone
	if ('standalone' in window.navigator && window.navigator.standalone) {
		return true;
	}
	// Android TWA (Trusted Web Activity) 체크
	if (document.referrer.startsWith('android-app://')) {
		return true;
	}

	return false;
};
