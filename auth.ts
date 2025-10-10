import NextAuth from 'next-auth';
import bcrypt from 'bcrypt';
import Credentials from 'next-auth/providers/credentials';
import { connectDB } from './app/utils/db/database';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Kakao from 'next-auth/providers/kakao';
import Naver from 'next-auth/providers/naver';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { HTTPError } from './app/services/HTTPError';
import type { Adapter } from 'next-auth/adapters';
import { UserDB } from './app/types/next-auth';

export const {
	handlers,
	signIn,
	signOut,
	auth,
	unstable_update: update // Beta!
} = NextAuth({
	providers: [
		Credentials({
			// 로그인 요청시
			authorize: async credentials => {
				const { email, password } = credentials as unknown as UserDB;

				// 아이디 인증
				const db = (await connectDB).db(process.env.MONGODB_NAME);
				const userData: UserDB | null = await db
					.collection<UserDB>('users')
					.findOne({ email });

				if (!userData) {
					throw new HTTPError('존재하지 않는 계정입니다.', 401);
				}

				// 비밀번호 인증
				const pwcheck = await bcrypt.compare(
					password as string,
					userData.password as string
				);
				if (!pwcheck) {
					throw new HTTPError('패스워드가 틀렸습니다.', 401);
				}

				return userData;
			}
		}),
		GitHub({
			clientId: process.env.GITHUB_CLIENT_ID as string,
			clientSecret: process.env.GITHUB_CLIENT_SECRET as string
		}),
		Google({
			clientId: process.env.AUTH_GOOGLE_ID as string,
			clientSecret: process.env.AUTH_GOOGLE_SECRET as string
		}),
		Kakao({
			clientId: process.env.AUTH_KAKAO_ID as string,
			clientSecret: process.env.AUTH_KAKAO_SECRET as string
		}),
		Naver({
			clientId: process.env.AUTH_NAVER_ID as string,
			clientSecret: process.env.AUTH_NAVER_SECRET as string
		})
	],

	pages: {
		signIn: '/auth/login'
	},

	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60 //30일
	},

	callbacks: {
		async signIn({ user, account, profile, email, credentials }) {
			// credentials 로그인
			if (account?.provider === 'credentials') {
				return true;
			}

			// 소셜 로그인
			// 보충 데이터 (닉네임, 이메일)
			if (account?.provider !== 'credentials' && (!user.email || !user.name)) {
				const params = new URLSearchParams({
					provider: account?.provider || '',
					id: account?.providerAccountId || ''
				});

				// 기존 정보도 포함
				if (user.email) params.append('email', user.email);
				if (user.name) params.append('name', user.name);

				// 누락된 정보만 파라미터로 전달
				if (!user.email) params.append('missing', 'email');
				if (!user.name) params.append('missing', 'name');

				return '/auth/complete-profile?' + params.toString();
			}

			const db = (await connectDB).db(process.env.MONGODB_NAME);
			const existingUser = await db.collection('users').findOne({ email: user.email });

			// 소셜 로그인 이메일 중복 체크
			if (user.email && existingUser) {
				const existingAccount = await db.collection('accounts').findOne({
					userId: existingUser._id,
					provider: account?.provider,
					providerAccountId: account?.providerAccountId
				});
				if (existingAccount) {
					// 역할이 없으면 역할 추가
					if (!existingUser.role) {
						await db
							.collection('users')
							.updateOne({ email: user.email }, { $set: { role: 'user' } });
					}
					return true;
				}

				const params = new URLSearchParams({
					error: 'email-exists',
					email: user.email
				});

				// 로그인 거부
				return '/auth/login?' + params.toString();
			}

			return true;
		},
		redirect: async ({ url, baseUrl }) => {
			if (url.startsWith('/')) return `${baseUrl}${url}`;
			if (url) {
				const { search, origin } = new URL(url);
				const callbackUrl = new URLSearchParams(search).get('callbackUrl');
				if (callbackUrl)
					return callbackUrl.startsWith('/') ? `${baseUrl}${callbackUrl}` : callbackUrl;
				if (origin === baseUrl) return url;
			}
			return baseUrl;
		},
		jwt: async ({ token, user }) => {
			if (user) {
				token.user = {
					name: user.name!,
					email: user.email!,
					role: user.role
				};
			}
			return token;
		},
		session: async ({ session, token }) => {
			session.user = {
				...session.user,
				role: token.user.role
			};

			return session;
		}
	},

	adapter: MongoDBAdapter(connectDB) as Adapter
});
