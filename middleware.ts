import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
	const token = await getToken({
		req,
		cookieName:
			process.env.NODE_ENV === 'development'
				? 'authjs.session-token'
				: '__Secure-authjs.session-token',
		secret: process.env.AUTH_SECRET
	});

	if (!token) {
		return NextResponse.redirect(new URL(`/auth/login?callbackUrl=${req.url}`, req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/cart', '/wish', '/review/edit/:path*', '/user/:path*', '/admin/:path*'] // 보호 경로 설정
};
