import { getSession } from '@/app/actions/auth/authActions';
import { orderSchema } from '@/app/lib/zod/schemas/order';
import { connectDB } from '@/app/utils/db/database';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
	try {
		let order = await request.json();
		const session = await getSession();
		if (!session)
			return NextResponse.json(
				{
					success: false,
					message: '로그인이 필요합니다.'
				},
				{ status: 400 }
			);
		order.userEmail = session.user.email;
		order.timestmap = new Date().getTime();

		const validation = orderSchema.safeParse(order);
		if (validation.error) {
			return NextResponse.json(
				{
					success: false,
					message: validation.error.issues[0].message
				},
				{ status: 200 }
			);
		}
		order = validation.data;

		const db = await (await connectDB).db(process.env.MONGODB_NAME);
		await db.collection('orders').updateOne(
			{ _id: order._id, userEmail: session.user.email },
			{
				$set: {
					...order
				}
			}
		);

		return NextResponse.json(
			{
				success: true,
				message: `주문서를 업데이트 했습니다.`
			},
			{ status: 200 }
		);
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
