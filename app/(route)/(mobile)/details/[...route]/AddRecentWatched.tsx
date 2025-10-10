'use client';

import { createView } from '@/app/services/view';
import { useEffect, useState } from 'react';

interface AddRecentWatchedProps {
	itemId: string;
}

export default function AddRecentWatched({ itemId }: AddRecentWatchedProps) {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		if (!isMounted) return;

		const addRecentWatched = () => {
			const watched = localStorage.getItem('watched') ?? '[]';
			const watchedArr = JSON.parse(watched) as string[];

			// 중복 제거
			const duplicateIndex = watchedArr.indexOf(itemId);
			if (duplicateIndex !== -1) {
				watchedArr.splice(duplicateIndex, 1);
			}

			// 맨 앞에 추가
			watchedArr.unshift(itemId);

			// 최대수량 제한
			if (watchedArr.length > 15) {
				watchedArr.pop();
			}

			localStorage.setItem('watched', JSON.stringify(watchedArr));
		};

		addRecentWatched();
		createView(itemId);
	}, [itemId, isMounted]);

	return <></>;
}
