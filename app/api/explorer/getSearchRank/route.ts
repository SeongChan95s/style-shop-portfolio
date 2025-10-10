import { connectDB } from '@/app/utils/db/database';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const db = (await connectDB).db(process.env.MONGODB_NAME);

		// 현재 집계 (최근 전체)
		const nowResult = await db
			.collection('search')
			.aggregate([
				{
					$group: {
						_id: '$search',
						count: { $sum: 1 },
						latestTimestamp: { $max: '$timestamp' }
					}
				},
				{ $sort: { count: -1, latestTimestamp: -1 } },
				{ $limit: 5 }
			])
			.toArray();

		// 최신 검색어의 latestTimestamp에서 1시간 전을 기준으로 이전 집계
		const latestTimestamp =
			nowResult.length > 0 ? nowResult[0].latestTimestamp : new Date().getTime();
		const oneHourAgo = latestTimestamp - 1000 * 60 * 60;
		const prevResult = await db
			.collection('search')
			.aggregate([
				{ $match: { timestamp: { $lt: oneHourAgo } } },
				{
					$group: {
						_id: '$search',
						count: { $sum: 1 },
						latestTimestamp: { $max: '$timestamp' }
					}
				},
				{ $sort: { count: -1, latestTimestamp: -1 } },
				{ $limit: 5 }
			])
			.toArray();

		const prevRanks = prevResult.map(d => d._id);

		// 순위 상태 표시
		const rankedWithState = nowResult.map((d, i) => {
			const prevIdx = prevRanks.indexOf(d._id);
			let state: 'up' | 'down' | 'none' | 'new' = 'none';
			if (prevIdx === -1) state = 'new';
			else if (prevIdx > i) state = 'up';
			else if (prevIdx < i) state = 'down';
			else if (prevIdx === i) state = 'none';
			return {
				search: d._id,
				count: d.count,
				latestTimestamp: d.latestTimestamp,
				state
			};
		});

		return NextResponse.json(
			{ success: true, message: `성공`, data: rankedWithState },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ success: false, message: `${error}` }, { status: 500 });
	}
}
