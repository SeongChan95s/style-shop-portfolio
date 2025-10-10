import { getSession } from '@/app/actions/auth/authActions';
import { Wish } from '@/app/types';
import { connectDB } from '@/app/utils/db/database';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		const searchParams = req.nextUrl.searchParams;

		const nameParam = searchParams.get('name');
		const targetIdParam = searchParams.get('targetId');

		if (!nameParam || !targetIdParam)
			return NextResponse.json({
				success: false,
				message: '잘못된 요청입니다.',
				status: 400
			});
		const targetId = new ObjectId(targetIdParam);

		const session = await getSession();
		const db = (await connectDB).db(process.env.MONGODB_NAME);

		const wish = await db
			.collection('wishes')
			.find<Wish>({ targetId, name: nameParam })
			.toArray();
		const totalWish = wish?.length ?? 0;

		// 이미 추가했는지 체크
		let isAdded: boolean = false;
		if (wish && wish.filter(el => el.userEmail == session?.user?.email).length == 1) {
			isAdded = true;
		}

		return NextResponse.json({ isAdded, totalWish }, { status: 200 });
	} catch (err) {
		return NextResponse.json({ message: err }, { status: 500 });
	}
}
