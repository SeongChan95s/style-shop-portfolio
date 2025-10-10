import { getSession } from '@/app/actions/auth/authActions';
import { connectDB } from '@/app/utils/db/database';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const session = await getSession();

		if (!session) {
			return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
		}
		const userEmail = session.user?.email;

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const carts = await db.collection('carts').find({ userEmail }).toArray();
		const cartCount = carts.reduce((acc, cur) => acc + cur.count, 0);

		return NextResponse.json(cartCount, { status: 200 });
	} catch (err) {
		return NextResponse.json({ message: `${err}` }, { status: 500 });
	}
}
