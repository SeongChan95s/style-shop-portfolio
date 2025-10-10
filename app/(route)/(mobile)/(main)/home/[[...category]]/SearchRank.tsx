'use client';

import { SearchRankBoard } from '@/app/components/explorer';
import { getSearchRankWithProducts } from '@/app/services/explorer/getSearchRankWithProducts';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function SearchRank() {
	const { data: response } = useSuspenseQuery({
		queryFn: () => getSearchRankWithProducts({ limit: { group: 5, item: 1 } }),
		queryKey: ['search', 'rank']
	});

	return (
		<section className="sectionLayoutMd">
			<header className="headerLayoutSm inner">
				<h3>인기 검색어</h3>
			</header>
			{response.success ? (
				<SearchRankBoard data={response.data} />
			) : (
				<p>인기 검색순위가 없습니다.</p>
			)}
		</section>
	);
}
