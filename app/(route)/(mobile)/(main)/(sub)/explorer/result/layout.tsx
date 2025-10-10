'use client';

import { useSearchParams } from 'next/navigation';
import RelatedSearch from './RelatedSearch';
import CategoryMenu from './CategoryMenu';
import { useExplorer } from './result.hooks';
import Filter from './Filter';

interface ExplorerResultLayoutProps {
	children: React.ReactNode;
}

export default function ExplorerResultLayout({ children }: ExplorerResultLayoutProps) {
	const searchPrams = useSearchParams();
	const search = searchPrams.get('search') ?? '';

	useExplorer({ search });

	return (
		<>
			{search && <RelatedSearch search={search} />}
			<CategoryMenu search={search} />
			<Filter />
			{children}
		</>
	);
}
