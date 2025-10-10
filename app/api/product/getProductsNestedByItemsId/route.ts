import { ProductItemCollection } from '@/app/types';
import { connectDB } from '@/app/utils/db/database';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		const searchParams = req.nextUrl.searchParams;
		const itemsIdParam = searchParams.get('itemsId');
		if (!itemsIdParam)
			return NextResponse.json({ message: 'itemsId가 필요합니다.' }, { status: 400 });
		let itemsId = JSON.parse(itemsIdParam) as string[] | ObjectId[];
		itemsId = itemsId.map(id => new ObjectId(id as string));

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const itemsIdStrArr = itemsId.map(id => id.toString());

		const products = await db
			.collection<ProductItemCollection[]>('productItems')
			.aggregate([
				{ $match: { _id: { $in: itemsId } } },
				{
					$lookup: {
						from: 'productGroups',
						localField: 'groupId',
						foreignField: '_id',
						as: 'group'
					}
				},
				{ $unwind: '$group' },
				{
					$lookup: {
						from: 'productItems',
						localField: 'groupId',
						foreignField: 'groupId',
						as: 'allItems'
					}
				},
				{
					$addFields: {
						sortIndex: {
							$indexOfArray: [itemsIdStrArr, { $toString: '$_id' }]
						},
						items: {
							$map: {
								input: {
									$concatArrays: [
										{
											$filter: {
												input: '$allItems',
												as: 'item',
												cond: { $in: [{ $toString: '$$item._id' }, itemsIdStrArr] }
											}
										},
										{
											$filter: {
												input: '$allItems',
												as: 'item',
												cond: { $not: { $in: [{ $toString: '$$item._id' }, itemsIdStrArr] } }
											}
										}
									]
								},
								as: 'item',
								in: {
									_id: '$$item._id',
									images: '$$item.images',
									option: '$$item.option',
									stock: '$$item.stock'
								}
							}
						}
					}
				},
				{ $sort: { sortIndex: 1 } },
				{
					$project: {
						_id: '$group._id',
						name: '$group.name',
						brand: '$group.brand',
						price: '$group.price',
						category: '$group.category',
						items: '$items'
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
		return NextResponse.json({ success: false, message: `${err}` }, { status: 500 });
	}
}
