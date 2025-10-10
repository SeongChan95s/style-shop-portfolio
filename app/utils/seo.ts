export const shareUrl = (title: string, text: string) => {
	if (navigator.share) {
		navigator.share({
			title: title,
			text: text,
			url: window.location.href
		});
	}
};
