import { ProductItemCollection } from '@/app/types';
import { connectDB } from '@/app/utils/db/database';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	const client = await connectDB;
	const db = client.db(process.env.MONGODB_NAME);
	const searchParams = req.nextUrl.searchParams;

	const itemId = searchParams.get('itemId');
	if (!itemId) {
		return NextResponse.json(
			{ success: false, message: 'itemId가 없습니다.' },
			{ status: 400 }
		);
	}

	const item = await db
		.collection<ProductItemCollection>('productItems')
		.findOne({ _id: new ObjectId(itemId as string) });
	if (!item)
		return NextResponse.json(
			{ message: 'itemId와 일치하는 item이 없습니다.' },
			{ status: 400 }
		);

	const product = await db
		.collection('productGroups')
		.aggregate([
			{ $match: { _id: item.groupId } },
			{
				$lookup: {
					from: 'productItems',
					let: { groupId: '$_id' },
					pipeline: [
						{ $match: { $expr: { $eq: ['$groupId', '$$groupId'] } } },
						{ $addFields: { isTarget: { $eq: ['$_id', item._id] } } },
						{ $sort: { isTarget: -1 } },
						{
							$project: {
								isTarget: 0
							}
						}
					],
					as: 'items'
				}
			}
		])
		.toArray();

	if (!product || !product[0])
		return NextResponse.json(
			{
				success: false,
				message: `_id:${item._id.toString()}와 일치하는 item이없습니다.`
			},
			{ status: 500 }
		);

	return NextResponse.json(
		{
			success: true,
			message: '상품정보를 가져왔습니다.',
			data: product[0]
		},
		{ status: 200 }
	);
}
