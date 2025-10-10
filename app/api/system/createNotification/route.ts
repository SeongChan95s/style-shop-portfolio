import { connectDB } from '@/app/utils/db/database';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		const { type, body } = await req.json();

		const db = (await connectDB).db(process.env.MONGODB_NAME);

		await db.collection('notification').insertOne({
			type,
			body
		});

		return NextResponse.json({ message: '알람 생성에 성공했습니다.' }, { status: 200 });
	} catch (err) {
		return NextResponse.json({ message: `${err}` }, { status: 500 });
	}
}
