import { View } from '@/app/types';
import { HTTPError } from '../HTTPError';

export const getViewsByBefore = async (period: number): Promise<View[]> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/view/getViewsByBefore?period=${period}`
	);
	const result = await response.json();

	if (!response.ok) throw new HTTPError(result.message, response.status);
	return result;
};
