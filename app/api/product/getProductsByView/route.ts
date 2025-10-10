import { connectDB } from '@/app/utils/db/database';
import { getDateBefore } from '@/app/utils/date';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const periodParam = searchParams.get('period');

		const beforeDate = getDateBefore(Number(periodParam));

		const search = searchParams.get('search') ?? '';
		const searchWords = search
			.trim()
			.split(' ')
			.filter(word => word.trim() !== '');

		const matchParam = searchParams.get('match');
		const match = matchParam ? JSON.parse(matchParam) : {};
		const groupMatch = match.group || {};
		const matchCondition =
			searchWords.length > 0
				? {
						$or: searchWords.map(word => ({
							$or: [
								{ name: { $regex: word, $options: 'iu' } },
								{ brand: { $regex: word, $options: 'iu' } },
								{ keywords: { $regex: word, $options: 'iu' } }
							]
						})),
						...groupMatch
					}
				: groupMatch;

		let sort: string | null | object = JSON.parse(searchParams.get('sort') as string);
		sort = sort ? [{ $sort: sort }] : [{ $sort: { totalView: -1 } }];

		const skip: number = parseInt((searchParams.get('skip') as string) ?? 0);

		const limit = JSON.parse(searchParams.get('limit') as string);
		limit.number = limit.total ?? 0;
		limit.group = limit.group ? [{ $limit: parseInt(limit.group) }] : [];
		limit.item = limit.item ? [{ $limit: parseInt(limit.item) }] : [];
		limit.total = limit.total ? [{ $limit: parseInt(limit.total) }] : [];

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const products = await db
			.collection('productGroups')
			.aggregate([
				{ $match: matchCondition },
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
				{ $unwind: '$items' },
				{
					$lookup: {
						from: 'views',
						let: { itemId: '$items._id' },
						pipeline: [
							{
								$match: {
									$expr: { $eq: ['$itemId', '$$itemId'] },
									timestamp: { $gte: beforeDate }
								}
							}
						],
						as: 'view'
					}
				},
				{
					$addFields: {
						'items.view': { $size: '$view' }
					}
				},
				{
					$group: {
						_id: '$_id',
						name: { $first: '$name' },
						brand: { $first: '$brand' },
						price: { $first: '$price' },
						category: { $first: '$category' },
						items: { $push: '$items' },
						totalView: { $sum: '$items.view' }
					}
				},
				{
					$addFields: {
						items: {
							$sortArray: {
								input: '$items',
								sortBy: { view: -1 }
							}
						}
					}
				},
				...(sort as object[]),
				{ $skip: skip },
				...limit.total
			])
			.toArray();

		return NextResponse.json(
			{ success: true, data: products, message: '상품정보를 가져왔습니다.' },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json({ message: `${err}` }, { status: 500 });
	}
}
