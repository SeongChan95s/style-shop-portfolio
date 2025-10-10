import { connectDB } from '@/app/utils/db/database';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const alerts = await db.collection('notification').find({ type: 'alert' }).toArray();

		return NextResponse.json(alerts, { status: 200 });
	} catch (err) {
		return NextResponse.json({ message: `${err}` }, { status: 500 });
	}
}
