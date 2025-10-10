'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useGlobalStore } from '../store/globalStore';
import { usePathname } from 'next/navigation';

export default function GlobalContainer({ children }: { children: React.ReactNode }) {
	const layoutRef = useRef<HTMLDivElement>(null);
	const setLayoutWidth = useGlobalStore(state => state.setLayoutWidth);

	useEffect(() => {
		const handleLayoutWidth = () => {
			if (layoutRef.current) {
				const rect = layoutRef.current.getBoundingClientRect();
				setLayoutWidth(rect.width);
			}
		};

		handleLayoutWidth();

		window.addEventListener('resize', handleLayoutWidth);
		return () => window.removeEventListener('resize', handleLayoutWidth);
	}, []);

	const pathname = usePathname();

	const layoutId = useMemo(() => {
		if (pathname.includes('admin')) return 'desktopLayout';
		return 'mobileLayout';
	}, [pathname.includes('admin')]);

	return (
		<div id={layoutId} className="commonContainer" ref={layoutRef}>
			{children}
		</div>
	);
}
