import { connectDB } from '@/app/utils/db/database';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const searchParams = req.nextUrl.searchParams;
		const postId = searchParams.get('postId');

		const comments = await db
			.collection('comments')
			.aggregate([
				{
					$match: {
						postId: new ObjectId(postId as string)
					}
				},
				{
					$lookup: {
						from: 'users', // 조인할 컬렉션 이름
						localField: 'userEmail',
						foreignField: 'email',
						as: 'author' // 결과 배열에 추가할 필드 이름
					}
				},
				{
					$unwind: '$author' // 각 배열 데이터에 대해
				},
				{
					$project: {
						'author.password': 0
					}
				}
			])
			.toArray();

		if (!comments) {
			return NextResponse.json(
				{ message: '댓글을 가져오는데 실패했습니다.' },
				{ status: 500 }
			);
		}

		return NextResponse.json(comments, { status: 200 });
	} catch (err) {
		return NextResponse.json({ message: `${err}` }, { status: 500 });
	}
}
