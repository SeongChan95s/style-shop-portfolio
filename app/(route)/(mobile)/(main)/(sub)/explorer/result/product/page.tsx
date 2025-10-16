'use client';

import { getProductFilter } from '@/app/services/explorer/getProductFilter';
import FilterSheet from '../FilterSheet';
import List from './List';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useFilterStore } from '../result.store';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ExplorerResultProduct {}

export default function ExplorerResultProduct({}: ExplorerResultProduct) {
	const searchParams = useSearchParams();
	const search = searchParams.get('search') ?? '';

	const { data, isError, isPending, isSuccess } = useQuery({
		queryFn: () => getProductFilter(),
		queryKey: ['search', 'filter', 'product']
	});

	useEffect(() => {
		useFilterStore.getState().resetStore();
	}, []);

	useEffect(() => {
		if (data && data.success) useFilterStore.getState().setFilter(data.data);
	}, [isSuccess]);

	if (isError) return <></>;
	if (isPending) return <></>;

	return (
		<>
			<List search={search} />
			<FilterSheet />
		</>
	);
}
