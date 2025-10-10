import { getSession } from '@/app/actions/auth/authActions';
import { connectDB } from '@/app/utils/db/database';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const brandId = searchParams.get('brandId');

		if (!brandId) {
			return NextResponse.json(
				{ success: false, message: 'brandId가 필요합니다.' },
				{ status: 400 }
			);
		}

		const session = await getSession();
		const db = (await connectDB).db(process.env.MONGODB_NAME);

		// 브랜드 문서 조회
		const brand = await db.collection('brands').findOne({ _id: new ObjectId(brandId) });

		if (!brand) {
			return NextResponse.json(
				{ success: false, message: '브랜드를 찾을 수 없습니다.' },
				{ status: 404 }
			);
		}

		const wishUsers = brand.wishUsers || [];
		const wishCount = wishUsers.length;

		// 로그인한 사용자인 경우 위시리스트 상태 확인
		let isWished = false;
		if (session?.user?.email) {
			isWished = wishUsers.includes(session.user.email);
		}

		return NextResponse.json(
			{
				success: true,
				data: {
					isWished,
					wishCount
				}
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ success: false, message: `${error}` }, { status: 500 });
	}
}
