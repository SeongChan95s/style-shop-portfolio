import { useEffect, useRef, useState } from 'react';
import { throttle } from '../utils';

type Flag = 'top' | 'up' | 'down' | 'bottom';

export default function useScrollFlag(): Flag {
	const [scrollFlag, setScrollFlag] = useState<Flag>('top');
	const beforeScrollY = useRef(0);

	const updateScroll = () => {
		const { scrollY } = window;

		// iOS elastic scrolling issue
		const screenHeight = window.innerHeight;
		const bodyHeight = document.body.scrollHeight;

		// 최상단
		if (scrollY == 0) {
			setScrollFlag('top');
		} else if (scrollY < 75) {
			setScrollFlag('up');
		} else if (scrollY == bodyHeight - screenHeight) {
			setScrollFlag('bottom');
		} else if (beforeScrollY.current > scrollY) {
			setScrollFlag('up');
		} else {
			setScrollFlag('down');
		}
		beforeScrollY.current = scrollY;
	};

	const scrollHandler = throttle(updateScroll, 100);

	useEffect(() => {
		window.addEventListener('scroll', scrollHandler);
		return () => {
			window.removeEventListener('scroll', scrollHandler);
		};
	}, []);

	return scrollFlag;
}
