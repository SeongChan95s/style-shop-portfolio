import { useEffect, useRef } from 'react';

interface UseInfiniteScrollProps {
	hasNextPage?: boolean;
	fetchNextPage: () => void;
}

/**
 * useInfiniteQuery와 인터섹션 옵져버를 조합한 무한 스크롤 훅입니다.
 * 옵져버가 포착되면 다음 페이지를 패칭합니다.
 * @param hasNextPage useInfiniteQuery의 다음 페이지 여부
 * @param fetchNextPage useInfiniteQuery의 다음 페이지 패칭 요청
 * @returns 감시 대상 요소
 */
export function useInViewInfiniteQuery({
	hasNextPage,
	fetchNextPage
}: UseInfiniteScrollProps) {
	const infiniteLoaderRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const target = infiniteLoaderRef.current;

		const observer = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					fetchNextPage();
				}
			});
		});

		if (target) {
			observer.observe(target);
		}

		return () => {
			if (target) observer.unobserve(target);
		};
	}, [hasNextPage, fetchNextPage]);

	return infiniteLoaderRef;
}
