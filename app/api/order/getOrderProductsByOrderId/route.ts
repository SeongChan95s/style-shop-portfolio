import { getSession } from '@/app/actions/auth/authActions';
import { getProductsNestedByItemsId } from '@/app/services/product';
import { Order, OrderProducts } from '@/app/types';
import { connectDB } from '@/app/utils/db/database';
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const orderId = searchParams.get('orderId');
		if (!orderId)
			return NextResponse.json({
				success: false,
				message: '주문번호가 필요합니다.'
			});

		const session = await getSession();
		if (!session)
			return NextResponse.json({
				success: false,
				message: '로그인이 필요합니다.'
			});

		const db = await (await connectDB).db(process.env.MONGODB_NAME);
		const order = await db
			.collection('orders')
			.findOne<Order>({ _id: new ObjectId(orderId) });
		if (!order) {
			return NextResponse.json({
				success: false,
				message: `주문정보를 찾을 수 없습니다.`
			});
		}

		const getProductsResult = await getProductsNestedByItemsId(
			order.products.map(product => product.productItemId.toString())
		);
		if (!getProductsResult.success)
			return NextResponse.json({
				success: false,
				message: `${getProductsResult.message}`
			});

		const ordersProducts: OrderProducts = {
			...order,
			products: getProductsResult.data.map((product, i) => ({
				...product,
				_id: new ObjectId(product._id),
				count: order.products[i].count
			}))
		};

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
