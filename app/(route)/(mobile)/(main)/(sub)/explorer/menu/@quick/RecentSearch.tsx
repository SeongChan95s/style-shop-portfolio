'use client';

import { useSession } from '@/app/providers';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MySwiper } from '@/app/components/common/Swiper';
import { IconClose } from '@/app/components/common/Icon';
import { deleteFromDB } from '@/app/services/db';
import { getRecentSearchBySession } from '@/app/services/explorer';
import { Chip } from '@/app/components/common/Chip';
import { useRouter } from 'next/navigation';
import { useExplorerStore } from '../../explorer.store';
import { Search } from '@/app/types';
import { RecentSearchSkeleton } from '../menu.skeleton';
import styles from './../menu.module.scss';

const deleteSearch = async (id: string) => {
	return await deleteFromDB('search', { _id: id });
};

export default function RecentSearch() {
	const router = useRouter();
	const session = useSession();

	const localSearch = useExplorerStore(state => state.search);
	const searchSlice = useExplorerStore(state => state.slice);

	const {
		data: searchData,
		isLoading,
		isError
	} = useQuery({
		queryFn: getRecentSearchBySession,
		queryKey: ['getRecentSearchBySession'],
		enabled: session ? true : false
	});

	const search = session ? searchData : { data: localSearch };

	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: deleteSearch,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['getRecentSearchBySession'] });
		}
	});

	const clickDeleteButton = (e: React.MouseEvent, search: Search) => {
		e.stopPropagation();
		if (!searchData) return;

		if (session) {
			mutation.mutate(search._id);
		} else {
			searchSlice(search);
		}
	};

	return (
		<section className={`${styles.recentSearch} sectionLayoutSm`}>
			<header className="headerLayoutSm">
				<div className="inner">
					<h3>최근 검색어</h3>
				</div>
			</header>
			{(isLoading || isError) && <RecentSearchSkeleton />}

			{search && 'data' in search && search.data && (
				<MySwiper slidesPerView="auto" inner>
					{search.data.map((el: Search) => (
						<Chip
							className={styles.chip}
							key={el._id}
							variant="depth"
							onClick={() => router.push(`/explorer/result/product?search=${el.search}`)}>
							{el.search}
							<IconClose onClick={e => clickDeleteButton(e, el)} />
						</Chip>
					))}
				</MySwiper>
			)}
		</section>
	);
}
