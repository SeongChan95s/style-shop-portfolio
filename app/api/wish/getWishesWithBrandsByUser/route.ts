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

		// 사용자가 위시한 브랜드 조회
		const wishedBrands = await db
			.collection('brands')
			.find({
				wishUsers: { $in: [userEmail] }
			})
			.toArray();

		return NextResponse.json(
			{
				success: true,
				data: wishedBrands
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ success: false, message: `${error}` }, { status: 500 });
	}
}