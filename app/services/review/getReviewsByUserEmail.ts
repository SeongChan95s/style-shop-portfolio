import { FetchResponse, ReviewsCollection } from '@/app/types';
import { HTTPError } from '../HTTPError';

export const getReviewsByUserEmail = async (
	userEmail: string
): Promise<FetchResponse<ReviewsCollection[]>> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/review/getReviewsByUserEmail?userEmail=${encodeURIComponent(userEmail)}`
	);
	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);

	return result;
};
