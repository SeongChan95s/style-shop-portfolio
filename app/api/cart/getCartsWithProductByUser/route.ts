import { getSession } from '@/app/actions/auth/authActions';
import { CartsCollection } from '@/app/types';
import { connectDB } from '@/app/utils/db/database';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const session = await getSession();

		if (!session) {
			return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
		}
		const userEmail = session.user.email;

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const carts = await db
			.collection<CartsCollection>('carts')
			.aggregate([
				{
					$match: {
						userEmail
					}
				},
				{
					$lookup: {
						from: 'productItems', // 조인할 컬렉션 이름
						localField: 'productItemId',
						foreignField: '_id',
						pipeline: [
							{
								$lookup: {
									from: 'productGroups',
									localField: 'groupId',
									foreignField: '_id',
									as: 'group'
								}
							},
							{
								$unwind: '$group'
							}
						],
						as: 'productItem' // 결과 배열에 추가할 필드 이름
					}
				},
				{
					$unwind: '$productItem' // 각 배열 데이터에 대해
				},
				{
					$project: {
						_id: 0,
						cartId: '$_id',
						productItemId: '$productItem._id',
						count: '$count',
						name: '$productItem.group.name',
						brand: '$productItem.group.brand',
						price: '$productItem.group.price',
						category: '$productItem.group.category',
						images: '$productItem.images',
						option: '$productItem.option',
						stock: '$productItem.stock'
					}
				}
			])
			.toArray();

		return NextResponse.json(
			{ success: true, message: '카트 정보를 불러왔습니다', data: carts },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json({ message: `${err}` }, { status: 500 });
	}
}
