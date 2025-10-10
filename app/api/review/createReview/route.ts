import { getSession } from '@/app/actions/auth/authActions';
import { ProductItemCollection } from '@/app/types';
import { connectDB } from '@/app/utils/db/database';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const session = await getSession();
		const body = await req.json();
		const { productItemId, orderId, text, images } = body;
		let { score } = body;
		score = Number(score);
		const timestamp = new Date().getTime();

		// 계정 할당
		if (!session)
			return NextResponse.json(
				{ message: `리뷰 작성 권한이 없습니다.` },
				{ status: 400 }
			);
		const userEmail = session.user.email;

		// groupId 확인
		const productItem = await db
			.collection<ProductItemCollection>('productItems')
			.findOne({ _id: new ObjectId(productItemId as string) });

		if (!productItem)
			return NextResponse.json(
				{ message: `해당되는 상품 그룹이 없습니다.` },
				{ status: 400 }
			);
		const productGroupId = productItem.groupId;

		await db.collection('reviews').insertOne({
			content: {
				text,
				images
			},
			score,
			productGroupId,
			productItemId: new ObjectId(productItemId as string),
			orderId: new ObjectId(orderId as string),
			userEmail,
			timestamp
		});

		return NextResponse.json({ message: '리뷰 작성에 성공했습니다.' }, { status: 200 });
	} catch (err) {
		return NextResponse.json({ message: `${err}` }, { status: 500 });
	}
}
