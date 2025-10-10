import Visual from './Visual';
import { handleFetch } from '@/app/utils';
import Overview from './Overview';
import MainDescription from './MainDescription';
import AddRecentWatched from './AddRecentWatched';
import { Divider } from '@/app/components/common/Divider';
import Review from './Review';
import { AsyncFetchBoundary } from '@/app/components/system';
import { getProductNestedByItemId } from '@/app/services/product';
import { notFound } from 'next/navigation';
import Purchase from './Purchase';
import { BrandSkeleton, OverviewSkeleton } from './details.skeleton';
import Brand from './Brand';
import styles from './details.module.scss';

export default async function DetailsPage({
	params
}: {
	params: Promise<{ route: string[] }>;
}) {
	const { route } = await params;
	const category = route[0];
	const productItemId = route[1];

	const [data, error] = await handleFetch({
		queryFn: getProductNestedByItemId(productItemId)
	});

	if (error) return notFound();
	const product = data.success ? data.data : null;

	if (!product) return <></>; // 여기서 상품 못찾는 오류 발생

	return (
		<div className={styles.detailsPage}>
			<AddRecentWatched itemId={productItemId} />
			<Visual product={product} />
			<AsyncFetchBoundary isClient loadingFallback={<BrandSkeleton />}>
				<Brand name={product.brand} />
			</AsyncFetchBoundary>
			<AsyncFetchBoundary isClient loadingFallback={<OverviewSkeleton />}>
				<Overview product={product} category={category} />
			</AsyncFetchBoundary>
			<Divider inner />

			<MainDescription product={product} />
			<Divider inner />
			<Review productGroupId={product._id} productItemId={productItemId} />
			<Purchase product={product} />
		</div>
	);
}
