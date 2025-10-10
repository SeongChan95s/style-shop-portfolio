import { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface useCssAnimation<T> {
	dependency: T;
	addClass?: string;
	initial?: boolean;
	endTime?: number;
}

export default function useCssAnimation<T>({
	dependency,
	addClass = 'play',
	initial = true,
	endTime
}: useCssAnimation<T>): [string, Dispatch<SetStateAction<string>>] {
	const [play, setPlay] = useState('');
	const [initialized, setInitialized] = useState(initial);

	useEffect(() => {
		if (!initialized) {
			setInitialized(true);
		} else {
			const setTimer = setTimeout(() => {
				setPlay(addClass);
			}, 10);

			if (endTime) {
				const endTimer = setTimeout(() => {
					setPlay('');
				}, endTime);

				return () => {
					clearTimeout(endTimer);
				};
			}

			return () => {
				clearTimeout(setTimer);
				setPlay('');
			};
		}
	}, [dependency]);

	return [play, setPlay];
}
