'use client';

import { useEffect, useRef } from 'react';

export default function useInfiniteScroll(onIntersect: () => void, enabled: boolean) {
	const targetRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!enabled) return;

		const observer = new IntersectionObserver(
			entries => {
				if (entries[0]?.isIntersecting) {
					onIntersect();
				}
			},
			{ threshold: 0.1 }
		);

		const target = targetRef.current;
		if (target) observer.observe(target);

		return () => {
			if (target) observer.unobserve(target);
		};
	}, [enabled, onIntersect]);

	return targetRef;
}
