import { Review } from '@/app/types';
import { HTTPError } from '../HTTPError';

export const getReviewById = async (reviewId: string): Promise<Review<string>> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/review/getReviewById?reviewId=${reviewId}`,
		{ cache: 'no-store' }
	);
	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);

	return result;
};
