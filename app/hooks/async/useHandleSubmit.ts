import { HTTPError } from '@/app/services/HTTPError';
import { FetchResponse } from '@/app/types';
import { useState } from 'react';

interface UseHandleSubmitParams<R, A> {
	fn: (formData: FormData, additionalData?: A) => Promise<FetchResponse<R>>;
	additionalData?: A;
	onSuccess?: (data: FetchResponse<R>) => void;
	onError?: (error: HTTPError) => void;
}

export const useHandleSubmit = <A, R = void>({
	fn,
	additionalData,
	onSuccess,
	onError
}: UseHandleSubmitParams<R, A>) => {
	const [result, setResult] = useState<FetchResponse<R> | null>(null);
	const [error, setError] = useState<HTTPError | null>(null);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		try {
			e.preventDefault();

			const formData = new FormData(e.currentTarget);
			const result = await fn(formData, additionalData);

			setResult(result);
			if (onSuccess) onSuccess(result);
		} catch (error) {
			if (error instanceof HTTPError) {
				setError(error);
				if (onError && error) onError(error);
			}
		}
	};

	return { result, error, handleSubmit };
};
