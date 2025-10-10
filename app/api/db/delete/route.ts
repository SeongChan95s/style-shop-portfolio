import { connectDB } from '@/app/utils/db/database';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
	try {
		const body = await req.json();
		if (body.target?._id) {
			body.target._id = new ObjectId(body.target._id as string);
		}

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		await db.collection(body.collection).deleteOne(body.target);

		return NextResponse.json(
			{ success: true, message: '데이터를 삭제했습니다.' },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json({ success: false, message: `${err}` }, { status: 500 });
	}
}
