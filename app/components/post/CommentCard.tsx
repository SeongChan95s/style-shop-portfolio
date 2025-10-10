'use client';

import { CommentType } from '@/app/types';
import { CommentMenu } from '.';
import { Card } from '../common/Card';
import styles from './CommentCard.module.scss';

export default function CommentCard({
	comment,
	isAuthor
}: {
	comment: CommentType;
	isAuthor: boolean;
}) {
	return (
		<Card className={styles.commentCard}>
			<div className={styles.cardContainer}>
				<div className={styles.cardHeader}>
					<p className={styles.author}>{comment.author.name}</p>
					<CommentMenu commentId={comment._id.toString()} isAuthor={isAuthor} />
				</div>
				<Card.Container className={styles.cardBody}>
					<p>{comment.content}</p>
				</Card.Container>
			</div>
		</Card>
	);
}
