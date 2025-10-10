import { ReviewsCollection } from '@/app/types';
import { connectDB } from '@/app/utils/db/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const userEmail = searchParams.get('userEmail');

		if (!userEmail) {
			return NextResponse.json(
				{ success: false, message: 'userEmail이 필요합니다.' },
				{ status: 400 }
			);
		}

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const reviews = await db
			.collection('reviews')
			.find<ReviewsCollection>({ userEmail })
			.toArray();

		return NextResponse.json({
			success: true,
			message: '리뷰를 가져왔습니다.',
			data: reviews
		});
	} catch (err) {
		return NextResponse.json({ success: false, message: `${err}` }, { status: 500 });
	}
}
