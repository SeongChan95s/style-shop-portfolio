import { DependencyList, RefObject, useEffect } from 'react';

export default function useSetHeightProperty(
	ref: RefObject<HTMLHeadElement | null>,
	property: string,
	deps?: DependencyList
) {
	useEffect(() => {
		if (ref && ref.current) {
			let refHeight = ref.current.getBoundingClientRect().height;
			refHeight = Math.ceil(refHeight);
			document.documentElement.style.setProperty(property, refHeight + 'px');
		}
	}, [deps]);
}
