import { connectDB } from '@/app/utils/db/database';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
	try {
		const { productItemId, images } = await req.json();

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		await db.collection('productItems').updateOne(
			{ _id: new ObjectId(productItemId as string) },
			{
				$set: { images }
			}
		);

		return NextResponse.json(
			{
				success: true,
				message: ''
			},
			{ status: 200 }
		);
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
