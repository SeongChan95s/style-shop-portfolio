import { HTTPError } from '@/app/services/HTTPError';
import { FetchResponse } from '@/app/types';
import { useState } from 'react';

interface UseSubmitAction<I, R, A> {
	action: (
		initialData: I | undefined,
		formData: FormData,
		additionalData?: A
	) => Promise<FetchResponse<R>>;
	initialData?: I;
	additionalData?: A;
	onSuccess?: (data: FetchResponse<R>) => void;
	onError?: (error: HTTPError) => void;
}

export const useSubmitAction = <I, A, R = void>({
	action,
	initialData,
	additionalData,
	onSuccess,
	onError
}: UseSubmitAction<I, R, A>) => {
	const [result, setResult] = useState<FetchResponse<R> | null>(null);
	const [error, setError] = useState<HTTPError | null>(null);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		try {
			e.preventDefault();

			const formData = new FormData(e.currentTarget);
			const result = await action(initialData, formData, additionalData);

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
