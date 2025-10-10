import { HTTPError } from '../HTTPError';

export const updateReview = async (
	postId: string,
	text: string,
	images: string[],
	score: string
): Promise<{ message: string }> => {
	const response = await fetch(`/api/review/updateReview`, {
		method: 'POST',
		body: JSON.stringify({
			postId,
			text,
			images,
			score
		})
	});
	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);

	return result;
};
