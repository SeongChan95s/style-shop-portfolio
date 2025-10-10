import CommentList from './CommentList';
import { handleFetch } from '@/app/utils';
import ReviewContent from './ReviewContent';
import { Divider } from '@/app/components/common/Divider';
import CommentForm from './CommentForm';
import { ErrorDisplay } from '@/app/components/system';
import { getReviewById } from '@/app/services/review';
import styles from './page.module.scss';

export default async function ReviewDetailsPage({
	params
}: {
	params: Promise<{ postId: string }>;
}) {
	const { postId } = await params;
	const [review, error] = await handleFetch({
		queryFn: getReviewById(postId)
	});

	if (error) return <ErrorDisplay message={error.message} />;

	return (
		<div className={styles.reviewDetailsPage}>
			<ReviewContent review={review} />
			<Divider inner />
			<CommentList postId={postId} />
			<CommentForm postId={postId} />
		</div>
	);
}
