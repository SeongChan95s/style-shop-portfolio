import MainVisual from './MainVisual';
import QuickContents from './QuickContents';
import ProductRecommend from './ProductRecommend';
import { redirect } from 'next/navigation';
import { AsyncFetchBoundary } from '@/app/components/system';
import TrendProduct from './TrendProduct';
import MagazineStand from './MagazineStand';
import SearchRank from './SearchRank';
import { translateCategory } from '@/app/utils/translate/translateCategory';
import InfiniteSections from './InfiniteSections';
import {
	MainVisualSkeleton,
	QuickContentsSkeleton,
	ProductRecommendSkeleton,
	MagazineStandSkeleton
} from './home.skeleton';
import styles from './home.module.scss';

const checkParams = (params: string[] | undefined) => {
	const validCategory = ['man', 'woman', undefined];
	if (Array.isArray(params)) {
		if (!validCategory.includes(params?.[0]) || params.length > 1) return false;
	}
	return true;
};

interface HomePageProps {
	params: Promise<{ category?: string[] }>;
}

export default async function HomePage({ params }: HomePageProps) {
	const { category: categoryParams } = await params;
	if (!checkParams(categoryParams)) redirect('/');

	const category = categoryParams?.[0];
	const productCategoryQuery = category
		? { match: { group: { 'category.gender': translateCategory(category) } } }
		: undefined;
	const magazineQuery = category
		? { match: { keywords: { $in: [translateCategory(category)] } } }
		: undefined;

	return (
		<div className={styles.homePage}>
			<AsyncFetchBoundary isClient loadingFallback={<MainVisualSkeleton />}>
				<MainVisual />
			</AsyncFetchBoundary>

			<AsyncFetchBoundary isClient loadingFallback={<QuickContentsSkeleton />}>
				<QuickContents />
			</AsyncFetchBoundary>

			<TrendProduct query={productCategoryQuery} />

			<AsyncFetchBoundary isClient loadingFallback={<ProductRecommendSkeleton />}>
				<ProductRecommend query={productCategoryQuery} />
			</AsyncFetchBoundary>

			<AsyncFetchBoundary isClient loadingFallback={<MagazineStandSkeleton />}>
				<MagazineStand query={magazineQuery} />
			</AsyncFetchBoundary>

			<AsyncFetchBoundary isClient>
				<SearchRank />
			</AsyncFetchBoundary>

			<InfiniteSections category={category} />
		</div>
	);
}
