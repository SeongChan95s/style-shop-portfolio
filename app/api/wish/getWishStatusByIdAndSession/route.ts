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
				message: '잘못된 요청입니다.'
			});
		const targetId = new ObjectId(targetIdParam);

		const session = await getSession();

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const wishes = await db
			.collection('wishes')
			.find<Wish>({ targetId, name: nameParam })
			.toArray();

		return NextResponse.json(
			{
				success: true,
				data: {
					count: wishes.length,
					entry: session
						? wishes.some(wish => wish.userEmail == session.user.email)
						: false
				}
			},
			{ status: 200 }
		);
	} catch (err) {
		console.log('err', err);
		return NextResponse.json({ message: `${err}` }, { status: 500 });
	}
}
