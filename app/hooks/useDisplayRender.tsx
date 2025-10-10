import { useEffect, useState } from 'react';

export const useDelayedRender = <T,>(items: T[], delay: number): T[] => {
	const [visibleItems, setVisibleItems] = useState<T[]>([]);

	useEffect(() => {
		const timeouts = items.map((item, index) =>
			setTimeout(() => {
				setVisibleItems(prevItems => [...prevItems, item]);
			}, index * delay)
		);

		return () => timeouts.forEach(clearTimeout);
	}, [items, delay]);

	return visibleItems;
};
