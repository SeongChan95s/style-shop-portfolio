import { connectDB } from '@/app/utils/db/database';
import { NextRequest, NextResponse } from 'next/server';
import { Order } from '@/app/types';

export async function GET(request: NextRequest) {
	try {
		const authHeader = request.headers.get('authorization');
		const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

		if (authHeader !== expectedAuth) {
			return NextResponse.json(
				{
					success: false,
					message: '인증되지 않은 요청입니다.'
				},
				{ status: 401 }
			);
		}

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const now = new Date().getTime();

		// 반품 관련 상태가 아닌 주문만 조회
		const orders = await db
			.collection<Order>('orders')
			.find({
				status: { $in: ['receive', 'shipped', 'completed'] }
			})
			.toArray();

		let updatedCount = 0;

		// 상태 업데이트
		for (const order of orders) {
			const elapsedMinutes = (now - order.timestamp) / (1000 * 60);
			let newStatus: Order['status'] | null = null;

			if (order.status === 'receive' && elapsedMinutes >= 5) {
				newStatus = 'shipped';
			} else if (order.status === 'shipped' && elapsedMinutes >= 10) {
				newStatus = 'completed';
			} else if (order.status === 'completed' && elapsedMinutes >= 15) {
				newStatus = 'confirmed';
			}

			if (newStatus) {
				await db.collection('orders').updateOne(
					{ _id: order._id },
					{
						$set: {
							status: newStatus
						}
					}
				);
				updatedCount++;
			}
		}

		return NextResponse.json(
			{
				success: true,
				message: `${updatedCount}개의 주문 상태가 업데이트되었습니다.`,
				data: {
					totalChecked: orders.length,
					updated: updatedCount
				}
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error('Order status update error:', error);
		return NextResponse.json(
			{
				success: false,
				message: `주문 상태 업데이트 중 오류가 발생했습니다: ${error}`
			},
			{ status: 500 }
		);
	}
}
