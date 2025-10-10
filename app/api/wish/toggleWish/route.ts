import { getSession } from '@/app/actions/auth/authActions';
import { connectDB } from '@/app/utils/db/database';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		const session = await getSession();
		const body = await req.json();
		let { targetId } = body;
		targetId = new ObjectId(targetId as string);
		const { name } = body;

		const userEmail = session?.user?.email;

		if (!session || !userEmail) {
			return NextResponse.json(
				{ success: false, message: '로그인이 필요합니다.' },
				{ status: 400 }
			);
		}

		// 이미 추가했는지 체크
		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const wish = await db.collection('wishes').findOne({ targetId, name, userEmail });

		if (wish) {
			await db.collection('wishes').deleteOne({ targetId, name, userEmail });

			return NextResponse.json({
				success: true,
				message: '위시리스트에서 삭제했습니다.'
			});
		}

		// 위시 추가
		await db.collection('wishes').insertOne({
			targetId,
			name,
			userEmail
		});

		return NextResponse.json(
			{ success: true, message: '위시리스트에 추가했습니다.' },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json({ success: false, message: `${err}` }, { status: 500 });
	}
}
