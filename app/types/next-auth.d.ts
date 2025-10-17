import { DefaultSession } from 'next-auth';

export interface UserDB extends UserToken, UserOptionalInfo {
	_id: string;
	emailVerified?: true | null;
	password: string;
	tel?: string;
}

export interface UserToken {
	name: string;
	email: string;
	role: 'user' | 'admin';
}

export interface UserOptionalInfo {
	image?: string;
	height?: number;
	weight?: number;
	gender?: string;
}

declare module 'next-auth/jwt' {
	interface JWT {
		user: UserToken;
	}
}
declare module 'next-auth/core/jwt' {
	interface JWT {
		user: UserToken;
	}
}

declare module 'next-auth' {
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	interface User extends UserToken {}

	interface Session {
		user: User & DefaultSession['user'] & UserToken;
	}
}

export interface ClientSafeProvider {
	id: LiteralUnion<BuiltInProviderType>;
	name: string;
	type: ProviderType;
	signinUrl: string;
	callbackUrl: string;
	redirectTo: string;
}
