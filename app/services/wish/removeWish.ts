import { HTTPError } from '../HTTPError';

export const removeWish = async (name: string, targetId: string) => {
	const response = await fetch(`/api/wish/removeWish`, {
		method: 'DELETE',
		body: JSON.stringify({
			targetId,
			name
		})
	});

	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);
	return result;
};
