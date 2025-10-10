import { Chip } from '@/app/components/common/Chip';
import { SearchRankBoardSkeleton } from '@/app/components/explorer/SearchRankBoard';
import { ProductCard } from '@/app/components/product';

export function RecentSearchSkeleton() {
	return (
		<div className="column4 inner">
			<Chip.Skeleton className="columnItem" />
			<Chip.Skeleton className="columnItem" />
			<Chip.Skeleton className="columnItem" />
			<Chip.Skeleton className="columnItem" />
		</div>
	);
}

export function RecentProductSkeleton() {
	return (
		<div className="column3">
			<ProductCard.Skeleton className="columnItem" />
			<ProductCard.Skeleton className="columnItem" />
			<ProductCard.Skeleton className="columnItem" />
		</div>
	);
}

export function SearchRankSkeleton() {
	return (
		<section className="sectionLayoutSm inner">
			<header className="headerLayoutSm">
				<h3>인기 검색어</h3>
			</header>
			<SearchRankBoardSkeleton />
		</section>
	);
}
