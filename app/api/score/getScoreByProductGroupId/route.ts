import { connectDB } from '@/app/utils/db/database';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		const searchParams = req.nextUrl.searchParams;
		const productGroupId = searchParams.get('productGroupId');

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const data = await db
			.collection('reviews')
			.aggregate([
				{ $match: { productGroupId: new ObjectId(productGroupId as string) } },
				{
					$group: {
						_id: null,
						averageScore: { $avg: '$score' },
						count: { $sum: 1 }
					}
				},
				{
					$project: {
						_id: 0,
						count: 1,
						score: { $round: ['$averageScore', 1] }
					}
				}
			])
			.toArray();

		if (!data[0]) {
			return NextResponse.json({ scurress: true, score: 0, count: 0 }, { status: 200 });
		}

		return NextResponse.json(
			{ scurress: true, score: data[0].score, count: data[0].count },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json({ success: false, message: `${err}` }, { status: 500 });
	}
}
