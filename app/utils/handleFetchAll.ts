import { HandleFetchResponse } from '../types';

export const handleFetchAll = async <T>(
	promiseArray: Promise<HandleFetchResponse<T>>[]
): Promise<[T[], []]> => {
	const productPromiseAll = await Promise.all(promiseArray);

	const successes = productPromiseAll.filter(el => el[1] == null).map(el => el[0]);
	const errors = productPromiseAll.filter(el => el[0] == null).map(el => el[1]) as [];

	return [successes, errors];
};
