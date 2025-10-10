import { FetchResponse } from '@/app/types';
import { HTTPError } from '../HTTPError';

export async function getCallbackUrl(): Promise<FetchResponse<string>> {
	const response = await fetch('/api/auth/getCallbackUrl');
	const result = await response.json();

	if (!response.ok) {
		throw new HTTPError(result.message, response.status, response.url);
	}

	return result;
}
