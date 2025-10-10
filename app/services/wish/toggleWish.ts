import { HTTPError } from '../HTTPError';

export const toggleWish = async ({
	name,
	targetId
}: {
	name: string;
	targetId: string;
}) => {
	const response = await fetch(`/api/wish/toggleWish`, {
		method: 'POST',
		body: JSON.stringify({
			name,
			targetId
		})
	});
	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);
	return result;
};
