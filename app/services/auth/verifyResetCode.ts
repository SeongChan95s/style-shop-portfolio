import { HTTPError } from '../HTTPError';

interface VerifyResetCodeRequest {
	email: string;
	code: string;
}

interface VerifyResetCodeResponse {
	success: boolean;
	message: string;
}

export async function verifyResetCode(email: string, code: string): Promise<VerifyResetCodeResponse> {
	const requestData: VerifyResetCodeRequest = {
		email: email.trim(),
		code: code.trim()
	};

	const response = await fetch('/api/auth/verifyResetCode', {
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