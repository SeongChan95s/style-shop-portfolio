import { CommentType } from '@/app/types';
import { HTTPError } from '../HTTPError';

export const getCommentsByPostId = async (postId: string): Promise<CommentType[]> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/comment/getCommentsByPostId?postId=${postId}`
	);

	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);

	return result;
};
