import { getSession } from '@/app/actions/auth/authActions';
import { connectDB } from '@/app/utils/db/database';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
	try {
		const body = await req.json();
		const { commentId } = body;

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const comment = await db
			.collection('comments')
			.findOne({ _id: new ObjectId(commentId as string) });

		// 로그인 확인
		const session = await getSession();
		if (!(session && session.user && comment)) {
			return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 500 });
		}

		// 작성자 일치 확인
		if (comment?.userEmail != session?.user?.email) {
			return NextResponse.json({ message: '게시글 작성자가 아닙니다.' }, { status: 500 });
		}

		await db.collection('comments').deleteOne({ _id: new ObjectId(commentId as string) });

		return NextResponse.json({ message: '댓글 삭제에 성공했습니다.' }, { status: 200 });
	} catch (err) {
		return NextResponse.json({ message: `${err}` }, { status: 500 });
	}
}
