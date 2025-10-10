import { getSession } from '@/app/actions/auth/authActions';
import { connectDB } from '@/app/utils/db/database';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
	try {
		const session = await getSession();
		if (!session) {
			return NextResponse.json({
				success: false,
				message: '로그인이 필요합니다.'
			});
		}

		const { searchParams } = new URL(request.url);
		const orderId = searchParams.get('orderId');

		if (!orderId) {
			return NextResponse.json({
				success: false,
				message: '주문 ID가 필요합니다.'
			});
		}

		const client = await connectDB;
		const db = client.db(process.env.MONGODB_NAME);

		// 본인의 주문인지 확인하고 삭제
		const result = await db.collection('orders').deleteOne({
			_id: new ObjectId(orderId),
			userEmail: session.user.email
		});

		if (result.deletedCount === 0) {
			return NextResponse.json({
				success: false,
				message: '주문내역을 찾을 수 없거나 삭제 권한이 없습니다.'
			});
		}

		return NextResponse.json({
			success: true,
			message: '주문내역이 삭제되었습니다.'
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
