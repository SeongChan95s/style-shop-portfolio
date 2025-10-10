import { getSession } from '@/app/actions/auth/authActions';
import { connectDB } from '@/app/utils/db/database';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const orderId = searchParams.get('orderId');
		if (!orderId) return { success: false, message: 'orderId가 필요합니다.' };

		const session = await getSession();
		if (!session)
			return NextResponse.json({
				success: false,
				message: '로그인이 필요합니다.'
			});

		const db = await (await connectDB).db(process.env.MONGODB_NAME);
		const order = await db
			.collection('orders')
			.findOne({ _id: new ObjectId(orderId), userEmail: session.user.email });

		if (!order)
			return NextResponse.json({
				success: false,
				message: '주문이 없습니다.'
			});

		return NextResponse.json({
			success: true,
			data: order,
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
