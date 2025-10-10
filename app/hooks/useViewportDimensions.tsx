'use client';

import { useEffect, useState } from 'react';
import { getViewportDimensions } from '../utils';

export default function useViewportDimensions() {
	const [viewportDimensions, setViewportDimensions] = useState({ width: 0, height: 0 });

	useEffect(() => {
		setViewportDimensions(getViewportDimensions());

		const handleResize = () => {
			setViewportDimensions(getViewportDimensions());
		};
		window.addEventListener('resize', handleResize);

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return viewportDimensions;
}
