'use client';

import { SearchRankBoard } from '@/app/components/explorer';
import { getSearchRankWithProducts } from '@/app/services/explorer/getSearchRankWithProducts';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function SearchRank() {
	const { data } = useSuspenseQuery({
		queryFn: () => getSearchRankWithProducts({ limit: { group: 5, item: 1 } }),
		queryKey: ['getSearchRank']
	});

	return (
		<section className="sectionLayoutSm">
			<header className="headerLayoutSm inner">
				<h3>인기 검색어</h3>
			</header>
			<SearchRankBoard data={data.success ? data.data : []} />
		</section>
	);
}
