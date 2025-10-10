import { HTTPError } from '../HTTPError';

interface SendPasswordResetRequest {
	email: string;
}

interface SendPasswordResetResponse {
	success: boolean;
	message: string;
}

export async function sendPasswordReset(email: string): Promise<SendPasswordResetResponse> {
	const requestData: SendPasswordResetRequest = {
		email: email.trim()
	};

	const response = await fetch('/api/auth/sendPasswordReset', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(requestData)
	});

	const result = await response.json();

	if (!response.ok) {
		throw new HTTPError(result.message, response.status, response.url);
	}

	return result;
}