import { HTTPError } from '../HTTPError';

interface ResetPasswordRequest {
	email: string;
	password: string;
	passwordConfirm: string;
}

interface ResetPasswordResponse {
	success: boolean;
	message: string;
}

export async function resetPassword(
	email: string, 
	password: string, 
	passwordConfirm: string
): Promise<ResetPasswordResponse> {
	const requestData: ResetPasswordRequest = {
		email: email.trim(),
		password: password,
		passwordConfirm: passwordConfirm
	};

	const response = await fetch('/api/auth/resetPassword', {
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