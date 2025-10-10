import { HTTPError } from '../HTTPError';
interface CompleteProfileRequest {
	provider: string;
	providerId: string;
	email: string;
	name: string;
}

interface CompleteProfileResponse {
	message: string;
}

interface CompleteProfileData {
	provider: string;
	providerId: string;
	email: string;
	name: string;
}

export async function completeProfile(data: CompleteProfileData): Promise<CompleteProfileResponse> {
	const requestData: CompleteProfileRequest = {
		provider: data.provider,
		providerId: data.providerId,
		email: data.email.trim(),
		name: data.name.trim()
	};

	const response = await fetch('/api/auth/complete-profile', {
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