import { FetchResponse } from '@/app/types/index';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

type UseApiQueryResult<T> = {
	data: T | null;
	businessError: string | null;
	isLoading: boolean;
	systemError: Error | null;
};

export function useApiQuery<T>(
	queryKey: unknown[],
	queryFn: () => Promise<FetchResponse<T>>,
	options?: UseQueryOptions<FetchResponse<T>, Error>
): UseApiQueryResult<T> {
	const query = useQuery({
		queryKey,
		queryFn,
		throwOnError: false,
		...options
	});

	const result = query.data;

	return {
		data: result?.success === true && 'data' in result ? result.data : null,
		businessError: result?.success === false ? result.message : null,
		isLoading: query.isLoading,
		systemError: query.error
	};
}
