import { RefObject, useEffect, useRef } from 'react';

export default function useClickOutside<T extends HTMLElement>(
	click: boolean,
	setClick: (prev: boolean) => void
): [RefObject<T | null>, boolean] {
	const target = useRef<T>(null);

	useEffect(() => {
		const outsideClickHandle = (e: MouseEvent) => {
			if (target.current && !target.current?.contains(e.target as Node)) {
				setClick(false);
			}
		};

		window.addEventListener('click', outsideClickHandle);
		return () => {
			window.removeEventListener('click', outsideClickHandle);
		};
	}, [click]);

	return [target, click];
}
