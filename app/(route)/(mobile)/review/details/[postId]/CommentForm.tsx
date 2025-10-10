'use client';

import { Button } from '@/app/components/common/Button';
import { createComment } from '@/app/services/comment';
import { useActionState, useEffect } from 'react';
import { Input } from '@/app/components/common/Input';
import { HTTPError } from '@/app/services/HTTPError';
import { useSystemAlertStore } from '@/app/store';
import styles from './page.module.scss';
import { AppBar } from '@/app/components/common/AppBar';
import { useRouter } from 'next/navigation';

export default function CommentForm({ postId }: { postId: string }) {
	const createCommentAction = async (
		prevState: { message: string },
		formData: FormData
	) => {
		try {
			const content = (formData.get('input-comment') as string) ?? '';
			const result = await createComment(postId, content);

			return result;
		} catch (error) {
			if (error instanceof HTTPError) {
				return { message: error.message };
			}
		}
	};

	const [state, action] = useActionState(createCommentAction, { message: '' });
	const alertPush = useSystemAlertStore(state => state.push);
	const router = useRouter();

	useEffect(() => {
		if (state.message != '') {
			alertPush(state.message);
			router.refresh();
		}
	}, [state]);

	return (
		<form action={action}>
			<AppBar className={styles.commentForm}>
				<div className="inner">
					<Input
						className={styles.inputText}
						name="input-comment"
						placeholder="코멘트를 남겨주세요."
						variant="outlined"
						size="sm"
					/>
					<Button type="submit" size="sm">
						작성하기
					</Button>
				</div>
			</AppBar>
		</form>
	);
}
