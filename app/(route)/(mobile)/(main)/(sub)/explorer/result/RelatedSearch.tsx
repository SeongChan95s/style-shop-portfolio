'use client';

import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { getRelatedSearch } from '@/app/services/explorer/getRelatedSearch';
import styles from './result.module.scss';
import { MySwiper } from '@/app/components/common/Swiper';

interface RelatedSearchProps {
	search: string;
}
export default function RelatedSearch({ search }: RelatedSearchProps) {
	const { data: relatedSearch, isSuccess } = useQuery({
		queryFn: () => getRelatedSearch(search),
		queryKey: [search],
		enabled: search != ''
	});

	const pathname = usePathname();
	const category = pathname.substring(pathname.indexOf('result/') + 7);

	if (isSuccess && relatedSearch && relatedSearch.success && relatedSearch.data.length != 0) {
		return (
			<nav className={styles.relatedSearch}>
				<MySwiper spaceBetween={16} inner>
					{relatedSearch.data.map((el: { search: string }, i: number) => (
						<Link href={`/explorer/result/${category}/?search=${el.search}`} key={i}>
							{el.search}
						</Link>
					))}
				</MySwiper>
			</nav>
		);
	}

	return <></>;
}
