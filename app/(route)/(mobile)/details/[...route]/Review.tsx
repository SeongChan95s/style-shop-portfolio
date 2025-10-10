import { ReviewList } from '@/app/components/review';

export default function Review({
	productGroupId,
	productItemId
}: {
	productGroupId: string;
	productItemId: string;
}) {
	return (
		<section className="sectionLayoutMd reviewSection">
			<header className="headerLayoutMd inner">
				<h3>리뷰</h3>
			</header>
			<ReviewList productGroupId={productGroupId} productItemId={productItemId} />
		</section>
	);
}
