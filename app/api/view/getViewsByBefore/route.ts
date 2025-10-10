import { connectDB } from '@/app/utils/db/database';
import { getDateBefore } from '@/app/utils/date';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const periodParam = searchParams.get('period');

		// 날짜 계산
		const beforeDate = getDateBefore(Number(periodParam));

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const views = await db
			.collection('views')
			.aggregate([
				{
					$match: {
						timestamp: { $gte: beforeDate }
					}
				},
				{
					$group: {
						_id: '$productId',
						count: { $sum: 1 }
					}
				},
				{
					$sort: { count: -1 }
				},
				{
					$project: {
						_id: 0,
						productId: '$_id'
						// count: 1
					}
				}
			])
			.toArray();

		return NextResponse.json(views, { status: 200 });
	} catch (err) {
		return NextResponse.json({ message: `${err}` }, { status: 500 });
	}
}
