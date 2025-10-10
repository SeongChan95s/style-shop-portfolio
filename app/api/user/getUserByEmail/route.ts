import { UserDB } from '@/app/types/next-auth';
import { connectDB } from '@/app/utils/db/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const email = searchParams.get('email') as string;

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const usersCollection = db.collection<UserDB>('users');
		const user: UserDB | null = await usersCollection.findOne({
			email
		});

		return NextResponse.json(user, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: `${error}` }, { status: 500 });
	}
}
