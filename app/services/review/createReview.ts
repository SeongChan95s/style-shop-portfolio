import { HTTPError } from '../HTTPError';

export const createReview = async (
	productItemId: string,
	text: string,
	images: string[],
	score: string
): Promise<{ message: string }> => {
	const response = await fetch(`/api/review/createReview`, {
		method: 'POST',
		body: JSON.stringify({
			productItemId,
			text,
			images,
			score
		})
	});
	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);

	return result;
};
