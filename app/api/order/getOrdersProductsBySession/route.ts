import { getSession } from '@/app/actions/auth/authActions';
import { getProductsNestedByItemsId } from '@/app/services/product';
import { Order, OrderProducts, ReviewsCollection } from '@/app/types';
import { connectDB } from '@/app/utils/db/database';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET() {
	try {
		const session = await getSession();
		if (!session)
			return NextResponse.json({
				success: false,
				message: '로그인이 필요합니다.'
			});

		const db = await (await connectDB).db(process.env.MONGODB_NAME);
		const orders = await db
			.collection('orders')
			.find<Order>({ userEmail: session.user.email })
			.toArray();

		const getProductsPromise = orders.map(order =>
			getProductsNestedByItemsId(
				order.products.map(product => product.productItemId.toString())
			)
		);

		const getProductsResult = await Promise.all(getProductsPromise);
		if (!getProductsResult.every(r => r.success))
			return NextResponse.json(
				{
					success: false,
					message: `${getProductsResult.find(el => !el.success)?.message}`
				},
				{ status: 400 }
			);

		// 사용자의 리뷰 정보 가져오기
		const reviews = await db
			.collection('reviews')
			.find<ReviewsCollection>({ userEmail: session.user.email })
			.toArray();

		// orderId와 productItemId를 조합한 key로 map 생성
		const reviewMap = new Map(
			reviews.map(review => [
				`${review.orderId.toString()}_${review.productItemId.toString()}`,
				review._id.toString()
			])
		);

		const ordersProducts: OrderProducts[] = orders.map((order, i1) => ({
			...order,
			products: getProductsResult[i1].data.map((product, i2) => ({
				...product,
				_id: new ObjectId(product._id),
				count: order.products[i2].count,
				items: product.items.map(item => {
					const key = `${order._id.toString()}_${item._id}`;
					const reviewId = reviewMap.get(key);
					return {
						...item,
						reviewId,
						hasReview: reviewId !== undefined
					};
				})
			}))
		}));

		return NextResponse.json({
			success: true,
			data: ordersProducts,
			message: '주문정보를 불러왔습니다.'
		});
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				message: `${error}`
			},
			{ status: 500 }
		);
	}
}
