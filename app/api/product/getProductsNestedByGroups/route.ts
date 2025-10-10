import { ProductGroupCollection } from '@/app/types';
import { connectDB } from '@/app/utils/db/database';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		const searchParams = req.nextUrl.searchParams;
		const match = JSON.parse(searchParams.get('match') as string);

		if (match?.group?._id) match._id = new ObjectId(match.group._id as string);
		const matchGroupPipe = match?.group ? [{ $match: match.group }] : [];
		if (match?.item?._id) match._id = new ObjectId(match.item._id as string);
		const matchItemPipe = match?.item ? [{ $match: match.item }] : [];

		const sort = searchParams.get('sort') ? JSON.parse(searchParams.get('sort') as string) : [];
		const skip: number = parseInt((searchParams.get('skip') as string) ?? 0);
		const limitParam = JSON.parse(searchParams.get('limit') as string) || {};
		const limitGroupPipe = limitParam.group ? [{ $limit: parseInt(limitParam.group) }] : [];
		const limitItemPipe = limitParam.item ? [{ $limit: parseInt(limitParam.item) }] : [];
		const limitTotalPipe = limitParam.total ? [{ $limit: parseInt(limitParam.total) }] : [];

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const products = await db
			.collection<ProductGroupCollection>('productGroups')
			.aggregate([
				...matchGroupPipe,
				...limitGroupPipe,
				{
					$lookup: {
						from: 'productItems',
						let: { groupId: '$_id' },
						pipeline: [
							{
								$match: {
									$expr: { $eq: ['$groupId', '$$groupId'] },
									...matchItemPipe
								}
							},
							...limitItemPipe
						],
						as: 'items'
					}
				},
				{
					$match: {
						items: { $ne: [], $exists: true, $not: { $size: 0 } }
					}
				},
				...sort,
				{
					$skip: skip
				},
				...limitTotalPipe
			])
			.toArray();

		return NextResponse.json({ success: true, data: products }, { status: 200 });
	} catch (err) {
		return NextResponse.json({ message: `${err}` }, { status: 500 });
	}
}
