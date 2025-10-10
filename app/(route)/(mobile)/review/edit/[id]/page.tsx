import { redirect } from 'next/navigation';
import { getReviewById } from '@/app/services/review';
import PostForm from './PostForm';
import { handleFetch } from '@/app/utils';
import { getSession } from '@/app/actions/auth/authActions';
import ProductView from './ProductView';
import styles from './reviewEdit.module.scss';

export default async function ReviewEditPage({
	params,
	searchParams
}: {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ orderId?: string; itemId?: string; callbackUrl?: string }>;
}) {
	const { id } = await params;
	const { orderId: queryOrderId, itemId: queryItemId, callbackUrl } = await searchParams;

	const session = await getSession();

	let orderId: string;
	let itemId: string;
	let reviewId: string | undefined;
	let review = null;

	if (id === 'new') {
		if (!queryOrderId || !queryItemId) {
			redirect('/');
		}
		orderId = queryOrderId;
		itemId = queryItemId;
		reviewId = undefined;
	} else {
		reviewId = id;

		const [fetchedReview, error] = await handleFetch({
			queryFn: getReviewById(reviewId)
		});

		if (error || !fetchedReview) {
			redirect('/');
		}

		review = fetchedReview;
		orderId = review.orderId.toString();
		itemId = review.productItemId.toString();

		// 작성자 확인
		const checkUser = session?.user?.email === review.author.email;
		if (!checkUser) redirect('/');
	}

	return (
		<div className={`${styles.reviewEditPage}`}>
			<ProductView productItemId={itemId} />

			<PostForm
				review={review}
				productItemId={itemId}
				orderId={orderId}
				reviewId={reviewId}
				callbackUrl={callbackUrl}
			/>
		</div>
	);
}
