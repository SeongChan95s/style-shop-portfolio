import { getSession } from '@/app/actions/auth/authActions';
import { Wish } from '@/app/types';
import { connectDB } from '@/app/utils/db/database';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
	try {
		const body = await req.json();
		let { targetId } = body;
		const { name } = body;

		if (!targetId)
			return NextResponse.json({ message: 'targetId가 없습니다.' }, { status: 400 });
		targetId = new ObjectId(targetId as string);

		// 로그인 확인
		const session = await getSession();
		const userEmail = session?.user?.email;

		if (!session || !userEmail) {
			return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 500 });
		}

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const wish = await db.collection('wishes').findOne({ targetId, name, userEmail });

		// 이미 추가했는지 체크
		if (wish) {
			await db.collection<Wish>('wishes').deleteOne({ targetId, name, userEmail });
		}

		return NextResponse.json(
			{ message: '위시리스트에서 삭제했습니다.' },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json({ message: err }, { status: 500 });
	}
}
