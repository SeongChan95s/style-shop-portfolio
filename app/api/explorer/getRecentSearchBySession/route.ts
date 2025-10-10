import { getSession } from '@/app/actions/auth/authActions';
import { connectDB } from '@/app/utils/db/database';
import { NextResponse } from 'next/server';
import status from 'http-status';

export async function GET() {
	try {
		const session = await getSession();

		if (!session)
			return NextResponse.json(
				{ success: false, message: '로그인이 필요합니다.' },
				{ status: status.FORBIDDEN }
			);

		const db = (await connectDB).db(process.env.MONGODB_NAME);

		const result = await db
			.collection('search')
			.find({ userEmail: session.user.email })
			.sort({ timestamp: -1 })
			.toArray();

		return NextResponse.json(
			{ success: true, message: `성공`, data: result },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ success: false, message: `${error}` }, { status: 500 });
	}
}
