export const throttle = (callback: () => void, delay: number) => {
	let timer: ReturnType<typeof setTimeout> | null = null;

	return () => {
		if (timer) return;
		timer = setTimeout(() => {
			callback();
			timer = null;
		}, delay);
	};
};

// 사용 시
// const scrollHandler = throttle(updateScroll, 100);
