import { ProductGroupCollection } from '@/app/types';
import { connectDB } from '@/app/utils/db/database';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		const searchParams = req.nextUrl.searchParams;
		const productId = searchParams.get('productId');

		if (!productId) {
			return NextResponse.json({ message: '상품 ID가 필요합니다.' }, { status: 400 });
		}

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const products = await db
			.collection<ProductGroupCollection>('productGroups')
			.aggregate([
				{ $match: { _id: new ObjectId(productId) } },
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

		if (!products || products.length === 0) {
			return NextResponse.json({ message: '상품을 찾을 수 없습니다.' }, { status: 404 });
		}

		return NextResponse.json({ success: true, data: products[0] }, { status: 200 });
	} catch (err) {
		return NextResponse.json({ message: `${err}` }, { status: 500 });
	}
}
