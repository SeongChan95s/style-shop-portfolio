import { getSession } from '@/app/actions/auth/authActions';
import { Address, User } from '@/app/types';
import { connectDB } from '@/app/utils/db/database';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
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
				{ success: false, message: `존재하지 않는 회원입니다.` },
				{ status: 400 }
			);
		if (!user?.address)
			return NextResponse.json(
				{ success: false, message: `저장된 주소가 없습니다.` },
				{ status: 200 }
			);

		const address = await db
			.collection('address')
			.find<Address<ObjectId>>({
				_id: { $in: user.address }
			})
			.toArray();
		if (!address)
			return NextResponse.json(
				{ success: false, message: `사용자의 address id와 일치하는 주소가 없습니다.` },
				{ status: 400 }
			);

		return NextResponse.json({ success: true, data: address }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ success: false, message: `${error}` }, { status: 500 });
	}
}
