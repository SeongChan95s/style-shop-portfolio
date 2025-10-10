import { getSession } from '@/app/actions/auth/authActions';
import { connectDB } from '@/app/utils/db/database';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const session = await getSession();

		if (!session) {
			return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 200 });
		}

		const userEmail = session?.user?.email;
		const itemId = body.itemId;

		const timestamp = new Date().getTime();
		const db = (await connectDB).db(process.env.MONGODB_NAME);
		await db.collection('views').findOneAndUpdate(
			{
				userEmail,
				itemId: new ObjectId(itemId as string)
			},
			{ $set: { userEmail, itemId: new ObjectId(itemId as string), timestamp } },
			{ upsert: true }
		);

		return NextResponse.json({ message: '상품 뷰에 추가되었습니다.' }, { status: 200 });
	} catch (err) {
		return NextResponse.json({ message: `${err}` }, { status: 500 });
	}
}
