import { connectDB } from '@/app/utils/db/database';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		const { id } = await req.json();
		const db = (await connectDB).db(process.env.MONGODB_NAME);
		await db.collection('notification').deleteOne({ _id: new ObjectId(id as string) });

		return NextResponse.json({ message: '알람 삭제에 성공했습니다.' }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: `${error}` }, { status: 500 });
	}
}
