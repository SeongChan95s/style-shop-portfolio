import { connectDB } from '@/app/utils/db/database';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getSession } from '@/app/actions/auth/authActions';

export async function DELETE(req: Request) {
	try {
		const body = await req.json();
		body.cartId = new ObjectId(body.cartId as string);

		// 로그인 확인
		const session = await getSession();
		const userEmail = session?.user?.email;
		if (!session || !userEmail) {
			return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 400 });
		}

		const db = (await connectDB).db(process.env.MONGODB_NAME);

		// 이미 추가했는지 체크
		const cart = await db.collection('carts').findOne({ _id: body.cartId });
		if (cart) {
			await db.collection('carts').deleteOne({ _id: body.cartId });
		}

		return NextResponse.json({ message: '장바구니에서 삭제했습니다.' }, { status: 200 });
	} catch (err) {
		return NextResponse.json({ message: `${err}` }, { status: 500 });
	}
}
