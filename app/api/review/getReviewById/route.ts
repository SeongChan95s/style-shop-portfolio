import { connectDB } from '@/app/utils/db/database';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		const searchParams = req.nextUrl.searchParams;
		const reviewId = searchParams.get('reviewId');

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const reviews = await db
			.collection('reviews')
			.aggregate([
				{ $match: { _id: new ObjectId(reviewId as string) } },
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
					$project: {
						'author.password': 0
					}
				}
			])
			.toArray();

		return NextResponse.json(reviews[0], { status: 200 });
	} catch (err) {
		return NextResponse.json({ message: `${err}` }, { status: 500 });
	}
}
