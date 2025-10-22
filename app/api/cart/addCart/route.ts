import { Cart } from '@/app/types';
import { connectDB } from '@/app/utils/db/database';
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getSession } from '@/app/actions/auth/authActions';

export async function PUT(req: NextRequest) {
	try {
		const body = await req.json();

		const session = await getSession();
		const userEmail = session?.user?.email;
		if (!session) {
			return NextResponse.json(
				{ success: false, message: '로그인이 필요합니다.' },
				{ status: 200 }
			);
		}
		let productItemId = body?.productItemId;
		if (!productItemId)
			return NextResponse.json(
				{ success: false, message: 'productItemId가 없습니다.' },
				{ status: 400 }
			);
		productItemId = new ObjectId(body.productItemId as string) as ObjectId;

		const cartBase = { userEmail, productItemId };
		let count = 1;

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const cart = await db.collection<Cart>('carts').findOne(cartBase);

		// 기존 상품 카운트 + 1
		if (cart) {
			count = cart.count + 1;
			await db.collection('carts').updateOne(cartBase, { $set: { count } });
		}

		// 새 상품 추가
		if (!cart) {
			await db.collection('carts').insertOne({ ...cartBase, count });
		}

		return NextResponse.json(
			{ success: true, message: '장바구니에 상품을 추가했습니다.' },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json({ message: `${err}` }, { status: 500 });
	}
}
