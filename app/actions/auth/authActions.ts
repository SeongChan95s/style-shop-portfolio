'use server';

import { auth, signIn, signOut, update } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';

export async function signUpWithCredentials(initialData: unknown, formData: FormData) {
	const {
		userEmail: email,
		userPassword: password,
		userName: name,
		subscription
	} = Object.fromEntries(formData.entries()) as {
		userEmail: string;
		userPassword: string;
		userName: string;
		subscription?: string;
	};

	// subscription은 JSON 문자열로 전달되므로 파싱
	const parsedSubscription = subscription ? JSON.parse(subscription) : null;

	const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/auth/signUp`, {
		method: 'POST',
		body: JSON.stringify({ email, password, name, subscription: parsedSubscription })
	});
	const result = await response.json();

	return { success: true, message: result.message };
}

export async function signInWithCredentials(
	initialState: { message: string },
	formData: FormData
): Promise<{ message: string }> {
	try {
		await signIn('credentials', {
			email: formData.get('email') || '',
			password: formData.get('password') || ''
		});
	} catch (e) {
		if (isRedirectError(e)) {
			throw e;
		}
		if (e instanceof Error)
			return {
				message: (e.cause as { err: { message: string } }).err.message
			};
	}
	return { message: '로그인에 성공했습니다.' };
}

export const signInWithGitHub = async () => {
	await signIn('github');
};

export const signOutWithForm = async () => {
	await signOut();
};

export const getSession = async () => {
	return await auth();
};

export { update as updateSession };
