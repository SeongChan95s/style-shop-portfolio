import { CommentCard } from '@/app/components/post';
import { handleFetch } from '@/app/utils/handleFetch';
import { getCommentsByPostId } from '@/app/services/comment';
import { getSession } from '@/app/actions/auth/authActions';
import styles from './page.module.scss';
import { ErrorDisplay } from '@/app/components/system';

export default async function CommentList({ postId }: { postId: string }) {
	const session = await getSession();

	const [comments, error] = await handleFetch({
		queryFn: getCommentsByPostId(postId)
	});

	if (error) {
		return <ErrorDisplay message={error.message} />;
	}

	return (
		<section className={`${styles.commentList} sectionLayoutSm`}>
			<div className="inner">
				<header className="headerLayoutSm">
					<h3>댓글</h3>
				</header>

				{comments.map((comment, i) => (
					<CommentCard
						comment={comment}
						isAuthor={comment.userEmail == session?.user?.email}
						key={i}
					/>
				))}
			</div>
		</section>
	);
}
