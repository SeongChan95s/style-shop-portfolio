import { connectDB } from '@/app/utils/db/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		const searchParams = req.nextUrl.searchParams;

		let sort: string | null | object = searchParams.get('sort');
		if (sort === 'latest') {
			sort = [{ $sort: { createdAt: -1 } }];
		} else if (sort === 'comment') {
			sort = [{ $sort: { reviewCount: -1 } }];
		} else {
			sort = [];
		}
		const skip: number = parseInt((searchParams.get('skip') as string) ?? 0);
		const limit = JSON.parse(searchParams.get('limit') as string);
		limit.group = limit.group ? [{ $limit: parseInt(limit.group) }] : [];
		limit.item = limit.item ? [{ $limit: parseInt(limit.item) }] : [];
		limit.total = limit.total ? [{ $limit: parseInt(limit.total) }] : [];
		const match = JSON.parse(searchParams.get('match') as string);

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const products = await db
			.collection('productGroups')
			.aggregate([
				{
					$match: match?.group ?? {}
				},
				...limit.group,
				{
					$lookup: {
						from: 'productItems',
						let: { groupId: '$_id' },
						pipeline: [
							{
								$match: {
									$expr: { $eq: ['$groupId', '$$groupId'] },
									...(match?.item ?? {})
								}
							},
							...limit.item
						],
						as: 'items'
					}
				},
				...(sort as object[]),
				{
					$skip: skip
				},
				...limit.total
			])
			.toArray();

		return NextResponse.json({ success: true, data: products }, { status: 200 });
	} catch (err) {
		return NextResponse.json({ message: `${err}` }, { status: 500 });
	}
}
