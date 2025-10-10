import { connectDB } from '@/app/utils/db/database';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const body = await req.json();
		const { postId, text, images } = body;
		let { score } = body;
		score = Number(score);

		await db
			.collection('reviews')
			.updateOne(
				{ _id: new ObjectId(postId as string) },
				{ $set: { 'content.text': text, 'content.images': images, score } }
			);

		return NextResponse.json(
			{ message: '리뷰 업데이트에 성공했습니다.' },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json({ message: `${err}` }, { status: 500 });
	}
}
