import { getSession } from '@/app/actions/auth/authActions';
import { UserDB } from '@/app/types/next-auth';
import { connectDB } from '@/app/utils/db/database';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const session = await getSession();

		if (!session)
			return NextResponse.json(
				{ success: false, message: `로그인이 필요합니다` },
				{ status: 200 }
			);

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const usersCollection = db.collection<UserDB>('users');
		const user: UserDB | null = await usersCollection.findOne({
			email: session.user.email
		});

		return NextResponse.json({ success: true, data: user }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ success: false, message: `${error}` }, { status: 500 });
	}
}
