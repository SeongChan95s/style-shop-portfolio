import { connectDB } from '@/app/utils/db/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		const searchParams = req.nextUrl.searchParams;

		const search = searchParams.get('search') ?? '';
		const searchWords = search
			.trim()
			.split(' ')
			.filter(word => word.trim() !== '');

		const matchParam = searchParams.get('match');
		const match = matchParam ? JSON.parse(matchParam) : {};
		const groupMatch = match.group || {};

		let sort: string | null | object[] = searchParams.get('sort');
		sort = sort ? [{ $sort: JSON.parse(sort) }] : [];

		const matchPipe =
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

		let skip: string | null | object[] = searchParams.get('skip');
		skip = skip ? [{ $skip: parseInt(skip) }] : [];

		const limitParam = searchParams.get('limit');
		const limit: { group?: string; item?: string } = limitParam
			? JSON.parse(limitParam)
			: {};

		const finalLimit = limit.group
			? parseInt(limit.group)
			: limit.item
				? parseInt(limit.item)
				: 10;
		const groupLimitPipe = [{ $limit: finalLimit }];

		const itemLimitPipe: object[] = limit.item ? [{ $limit: parseInt(limit.item) }] : [];

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const products = await db
			.collection('productGroups')
			.aggregate([
				{
					$match: matchPipe
				},
				// views 컬렉션에서 조회수 계산
				{
					$lookup: {
						from: 'views',
						let: { groupId: '$_id' },
						pipeline: [
							{
								$match: {
									$expr: { $eq: ['$productGroupId', '$$groupId'] }
								}
							},
							{
								$group: {
									_id: null,
									totalView: { $sum: 1 }
								}
							}
						],
						as: 'viewsData'
					}
				},
				{
					$addFields: {
						totalView: {
							$ifNull: [{ $arrayElemAt: ['$viewsData.totalView', 0] }, 0]
						}
					}
				},
				{
					$project: {
						viewsData: 0
					}
				},
				...sort,
				...skip,
				...groupLimitPipe,
				{
					$sample: { size: finalLimit }
				},
				{
					$lookup: {
						from: 'productItems',
						let: { groupId: '$_id', searchWords: searchWords },
						pipeline: [
							{
								$match: {
									$expr: { $eq: ['$groupId', '$$groupId'] }
								}
							},
							{
								$addFields: {
									matchScore: {
										$size: {
											$filter: {
												input: '$$searchWords',
												as: 'word',
												cond: {
													$regexMatch: {
														input: '$option.color',
														regex: '$$word',
														options: 'iu'
													}
												}
											}
										}
									}
								}
							},
							{ $sort: { matchScore: -1 } },
							{ $project: { matchScore: 0 } },
							...itemLimitPipe
						],
						as: 'items'
					}
				}
			])
			.toArray();

		return NextResponse.json({ success: true, data: products }, { status: 200 });
	} catch (err) {
		return NextResponse.json({ message: `${err}` }, { status: 500 });
	}
}
