import { connectDB } from '@/app/utils/db/database';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const searchParams = req.nextUrl.searchParams;
		const postId = searchParams.get('postId');

		const commentsCount = await db
			.collection('comments')
			.countDocuments({ postId: new ObjectId(postId as string) });

		return NextResponse.json(commentsCount, { status: 200 });
	} catch (err) {
		return NextResponse.json({ message: `${err}` }, { status: 500 });
	}
}
