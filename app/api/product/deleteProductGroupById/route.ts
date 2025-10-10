import { connectDB } from '@/app/utils/db/database';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
	const { groupId } = await req.json();

	const db = (await connectDB).db(process.env.MONGODB_NAME);
	await db
		.collection('productGroups')
		.deleteOne({ _id: new ObjectId(groupId as string) });

	await db
		.collection('productItems')
		.deleteMany({ groupId: new ObjectId(groupId as string) });

	try {
		return NextResponse.json(
			{ success: true, message: '상품 그룹을 삭제했습니다.' },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json({ message: `${err}` }, { status: 500 });
	}
}
