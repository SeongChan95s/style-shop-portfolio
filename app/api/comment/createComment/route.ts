import { getSession } from '@/app/actions/auth/authActions';
import { connectDB } from '@/app/utils/db/database';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const session = await getSession();

		if (!session) {
			return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
		}

		body.userEmail = session?.user?.email;
		const { content, postId, userEmail } = body;

		await db.collection('comments').insertOne({
			content,
			userEmail,
			postId: new ObjectId(postId as string)
		});

		return NextResponse.json(
			{ message: '댓글을 성공적으로 작성하였습니다.' },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json({ message: `${err}` }, { status: 500 });
	}
}
