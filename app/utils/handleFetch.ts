import { HandleFetchResponse } from '@/app/types';
import { HTTPError } from '../services/HTTPError';

export const handleFetch = async <R>({
	queryFn,
	isConsole = true
}: {
	queryFn: Promise<R>;
	isConsole?: boolean;
}): Promise<HandleFetchResponse<R>> => {
	try {
		const result = await queryFn;
		return [result, null];
	} catch (e) {
		if (isConsole) console.error(e);
		return [null, e as HTTPError];
	}
};
