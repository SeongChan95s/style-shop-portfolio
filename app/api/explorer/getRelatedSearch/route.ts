import { connectDB } from '@/app/utils/db/database';
import { NextRequest, NextResponse } from 'next/server';
import status from 'http-status';

export async function GET(req: NextRequest) {
	try {
		const search = req.nextUrl.searchParams.get('search');

		if (!search) {
			return NextResponse.json(
				{ success: false, message: '잘못된 요청: 검색 파라미터가 없습니다.' },
				{ status: status.BAD_REQUEST }
			);
		}

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const searchTerms = search.split(' ').filter(term => term.length > 0);
		const results = await db
			.collection('search')
			.aggregate([
				{
					$match: {
						$or: searchTerms.map(term => ({
							search: { $regex: term, $options: 'iu', $ne: search }
						}))
					}
				},
				{
					$group: {
						_id: '$search',
						count: { $first: '$count' }
					}
				},
				{
					$project: {
						_id: 0,
						search: '$_id',
						count: 1
					}
				},

				{ $sort: { count: -1 } }
			])
			.toArray();

		return NextResponse.json(
			{ success: true, message: `성공`, data: results },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ success: false, message: `${error}` }, { status: 500 });
	}
}
