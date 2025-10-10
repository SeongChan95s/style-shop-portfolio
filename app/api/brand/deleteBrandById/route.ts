import { connectDB } from '@/app/utils/db/database';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
	try {
		const body = await request.json();
		if (!body?.id)
			return NextResponse.json({ success: false, message: '브랜드 아이디가 없습니다.' });

		const _id = new ObjectId(body.id as string);

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		await db.collection('brands').deleteOne({ _id });

		return NextResponse.json(
			{ success: true, message: `브랜드 데이터를 삭제했습니다.` },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ success: false, message: `${error}` }, { status: 500 });
	}
}
