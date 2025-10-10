import { getSession } from '@/app/actions/auth/authActions';
import { connectDB } from '@/app/utils/db/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		const searchParams = req.nextUrl.searchParams;
		const nameParam = searchParams.get('name');
		if (!nameParam)
			return NextResponse.json({
				success: false,
				message: '잘못된 요청입니다.'
			});

		const session = await getSession();
		if (!session)
			return NextResponse.json({
				success: false,
				message: '로그인이 필요합니다.'
			});

		const db = (await connectDB).db(process.env.MONGODB_NAME);

		const count = await db
			.collection('wishes')
			.countDocuments({ name: nameParam, userEmail: session.user.email });

		return NextResponse.json(
			{ success: true, message: '위시리스트 수를 불러왔습니다.', data: count },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json({ message: err }, { status: 500 });
	}
}
