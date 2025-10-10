'use client';

import FilterSheet from '../FilterSheet';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useFilterStore } from '../result.store';
import { getContentFilter } from '@/app/services/explorer/getContentFilter';
import List from './List';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ExplorerResultProduct {}

export default function ExplorerResultProduct({}: ExplorerResultProduct) {
	const searchParams = useSearchParams();
	const search = searchParams.get('search') ?? '';

	const { data, isError, isPending, isSuccess } = useQuery({
		queryFn: () => getContentFilter(),
		queryKey: ['search', 'filter', 'content']
	});

	useEffect(() => {
		useFilterStore.getState().resetStore();
	}, []);

	useEffect(() => {
		if (data && data.success) useFilterStore.getState().setFilter(data.data);
	}, [isSuccess]);

	if (isError) return <></>;
	if (isPending) return <></>;

	const filter = data.success ? data.data : {};

	return (
		<>
			<List search={search} />
			<FilterSheet />
		</>
	);
}
