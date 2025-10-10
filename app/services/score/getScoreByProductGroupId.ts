import { HTTPError } from '../HTTPError';

export const getScoreByProductGroupId = async (
	productGroupId: string
): Promise<{ success: boolean; score: number; count: number }> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/score/getScoreByProductGroupId?productGroupId=${productGroupId}`
	);

	const result = await response.json();

	if (!response.ok) {
		throw new HTTPError(result.message, response.status, response.url);
	}

	return result;
};
