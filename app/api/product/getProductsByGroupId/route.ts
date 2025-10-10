import { connectDB } from '@/app/utils/db/database';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		const searchParams = req.nextUrl.searchParams;
		const productId = searchParams.get('productId');

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const products = await db
			.collection('productGroups')
			.aggregate([
				{ $match: { _id: new ObjectId(productId as string) } },
				{
					$lookup: {
						from: 'productItems', // 조인할 컬렉션 이름
						localField: '_id',
						foreignField: 'groupId',
						as: 'items' // 결과 배열에 추가할 필드 이름
					}
				},
				{ $unwind: '$items' },
				{
					$project: {
						groupId: '$_id',
						itemId: '$items._id',
						name: '$name',
						brand: '$brand',
						price: '$price',
						category: '$category',
						images: '$items.images',
						options: '$items.options',
						stock: '$items.stock'
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

		return NextResponse.json(products, { status: 200 });
	} catch (err) {
		return NextResponse.json({ message: `${err}` }, { status: 500 });
	}
}
