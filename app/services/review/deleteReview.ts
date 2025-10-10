import { FetchResponse } from '@/app/types';
import { HTTPError } from '../HTTPError';

export const deleteReview = async (reviewId: string): Promise<FetchResponse> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/review/deleteReview`,
		{
			method: 'DELETE',
			body: JSON.stringify({ reviewId })
		}
	);
	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);

	return result;
};
