import { connectDB } from '@/app/utils/db/database';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const names = await db.collection('contents').distinct('name');
		const filter = { name: names };

		return NextResponse.json(
			{ success: true, message: `성공`, data: filter },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ success: false, message: `${error}` }, { status: 500 });
	}
}
