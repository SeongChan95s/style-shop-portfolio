import { connectDB } from '@/app/utils/db/database';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		const searchParams = req.nextUrl.searchParams;
		const groupsIdParam = searchParams.get('groupsId');
		if (!groupsIdParam)
			return NextResponse.json({ message: 'groupsId가 필요합니다.' }, { status: 400 });
		let groupsId = JSON.parse(groupsIdParam) as string[] | ObjectId[];
		groupsId = groupsId.map(id => new ObjectId(id as string));

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const products = await db
			.collection('productGroups')
			.aggregate([
				{ $match: { _id: { $in: groupsId } } },
				{
					$lookup: {
						from: 'productItems',
						let: { groupId: '$_id' },
						pipeline: [
							{
								$match: {
									$expr: { $eq: ['$groupId', '$$groupId'] }
								}
							}
						],
						as: 'items'
					}
				}
			])
			.toArray();

		if (!products) {
			return NextResponse.json(
				{ message: '상품정보를 찾을 수 없습니다.' },
				{ status: 400 }
			);
		}

		return NextResponse.json({ success: true, data: products }, { status: 200 });
	} catch (err) {
		return NextResponse.json({ message: `${err}` }, { status: 500 });
	}
}
