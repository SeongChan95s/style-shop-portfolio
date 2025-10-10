import { connectDB } from '@/app/utils/db/database';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		const searchParams = req.nextUrl.searchParams;

		let match: string | null | object = searchParams.get('match');
		match = match ? (JSON.parse(match) as object) : {};

		const groupId: string | null | ObjectId = searchParams.get('groupId');
		if (groupId) {
			match = { ...match, productGroupId: new ObjectId(groupId as string) };
		}
		const itemId: string | null | ObjectId = searchParams.get('itemId');
		if (itemId) {
			match = { ...match, productItemId: new ObjectId(itemId as string) };
		}

		const sort = searchParams.get('sort');
		const sortPipe = sort ? [{ $sort: JSON.parse(sort) }] : [];

		const skip: number = parseInt((searchParams.get('skip') as string) ?? 0);
		const limit = searchParams.get('limit') as string;
		const limitPipeline = limit ? [{ $limit: parseInt(limit, 10) }] : [];

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const reviews = await db
			.collection('reviews')
			.aggregate([
				{ $match: match },
				{
					$lookup: {
						from: 'users',
						localField: 'userEmail',
						foreignField: 'email',
						as: 'author'
					}
				},
				{
					$unwind: '$author' // 각 배열 데이터에 대해
				},
				{
					$lookup: {
						from: 'comments',
						localField: '_id',
						foreignField: 'postId',
						as: 'comment'
					}
				},
				{
					$addFields: {
						comment: { $size: '$comment' }
					}
				},
				{
					$lookup: {
						from: 'productItems',
						localField: 'productItemId',
						foreignField: '_id',
						as: 'productItem'
					}
				},
				{
					$unwind: '$productItem'
				},
				...sortPipe, // 최신순 정렬
				{
					$skip: skip
				},
				...limitPipeline,
				{
					$project: {
						productItemId: 0,
						productGroupId: 0,
						author: {
							_id: 0,
							password: 0,
							role: 0
						}
					}
				}
			])
			.toArray();

		return NextResponse.json(
			{ success: true, data: reviews, message: '리뷰를 불러왔습니다.' },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json({ success: false, message: `${err}` }, { status: 500 });
	}
}
