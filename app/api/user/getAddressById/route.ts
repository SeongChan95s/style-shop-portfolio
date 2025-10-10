import { getSession } from '@/app/actions/auth/authActions';
import { Address, User } from '@/app/types';
import { connectDB } from '@/app/utils/db/database';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	try {
		const searchParams = await request.nextUrl.searchParams;
		const id = searchParams.get('id');
		if (!id)
			return NextResponse.json(
				{ success: false, message: `주소 id가 없습니다.` },
				{ status: 400 }
			);

		const session = await getSession();
		if (!session)
			return NextResponse.json(
				{ success: false, message: `로그인이 필요합니다` },
				{ status: 400 }
			);

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const user = await db.collection('users').findOne<User>({
			email: session.user.email
		});
		if (!user)
			return NextResponse.json(
				{ success: false, message: `사용자와 일치하는 유저 정보가 없습니다.` },
				{ status: 400 }
			);
		if (!user.address)
			return NextResponse.json(
				{ success: false, message: `사용자가 저장중인 주소가 없습니다.` },
				{ status: 200 }
			);

		const address = await db.collection('address').findOne<Address<ObjectId>>({
			_id: new ObjectId(id)
		});
		if (!address)
			return NextResponse.json(
				{ success: false, message: `id와 일치하는 주소가 없습니다.` },
				{ status: 400 }
			);

		const addressIds = user.address.map(el => el.toString());

		if (!user?.address || !addressIds.includes(address._id.toString()))
			return NextResponse.json(
				{ success: false, message: '사용자의 주소가 아닙니다.' },
				{ status: 400 }
			);

		return NextResponse.json({ success: true, data: address }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ success: false, message: `${error}` }, { status: 500 });
	}
}
