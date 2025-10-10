import { getSession } from '@/app/actions/auth/authActions';
import { s3Delete } from '@/app/services/aws';
import { ReviewsCollection } from '@/app/types';
import { connectDB } from '@/app/utils/db/database';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
	try {
		// 로그인 확인
		const session = await getSession();
		if (!(session && session.user)) {
			return NextResponse.json(
				{ succces: false, message: '로그인이 필요합니다.' },
				{ status: 200 }
			);
		}

		// 게시글 확인
		const { reviewId } = await req.json();
		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const review = await db
			.collection<ReviewsCollection>('reviews')
			.findOne({ _id: new ObjectId(reviewId as string) });
		if (!review)
			return NextResponse.json(
				{ success: false, message: '게시글을 찾을 수 없습니다.' },
				{ status: 200 }
			);

		// 작성자 일치 확인
		if (review.userEmail != session?.user.email) {
			return NextResponse.json(
				{ success: false, message: '게시글 작성자가 아닙니다.' },
				{ status: 200 }
			);
		}

		// 관련 데이터 삭제
		await db.collection('reviews').deleteOne({ _id: new ObjectId(reviewId as string) });
		await db
			.collection('comments')
			.deleteMany({ postId: new ObjectId(reviewId as string) });

		// 이미지 삭제
		if (review.content.images.length > 0) {
			await s3Delete(review.content.images);
		}

		return NextResponse.json(
			{ success: true, message: '게시글을 삭제했습니다.' },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json({ success: false, message: `${err}` }, { status: 500 });
	}
}
