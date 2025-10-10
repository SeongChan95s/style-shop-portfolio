import { HTTPError } from '../HTTPError';

export const deleteFromDB = async (collection: string, target: object) => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/db/delete`, {
		method: 'DELETE',
		body: JSON.stringify({ collection, target })
	});
	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);
	return result;
};
