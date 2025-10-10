import RecentProduct from './RecentProduct';
import RecentSearch from './RecentSearch';
import SearchRank from './SearchRank';
import { AsyncFetchBoundary } from '@/app/components/system';
import { SearchRankSkeleton } from '../menu.skeleton';
import styles from './../menu.module.scss';

export default function QuickPage() {
	return (
		<div className={styles.quick}>
			<RecentSearch />
			<RecentProduct />
			<AsyncFetchBoundary isClient={true} loadingFallback={<SearchRankSkeleton />}>
				<SearchRank />
			</AsyncFetchBoundary>
		</div>
	);
}
