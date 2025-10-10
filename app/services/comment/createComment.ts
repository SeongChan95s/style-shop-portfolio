import { HTTPError } from '../HTTPError';

export const createComment = async (postId: string, content: string) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/comment/createComment`,
		{
			method: 'POST',
			body: JSON.stringify({
				postId,
				content
			})
		}
	);

	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);
	return result;
};
