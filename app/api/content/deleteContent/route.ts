import { getSession } from '@/app/actions/auth/authActions';
import { s3Delete } from '@/app/services/aws';
import { Content } from '@/app/types';
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

		// 콘텐츠 확인
		const { contentId } = await req.json();
		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const content = await db
			.collection<Content>('contents')
			.findOne({ _id: new ObjectId(contentId as string) });
		if (!content)
			return NextResponse.json(
				{ success: false, message: '콘텐츠를 찾을 수 없습니다.' },
				{ status: 200 }
			);

		// 관리자 권한 확인
		if (session?.user.role !== 'admin') {
			return NextResponse.json(
				{ success: false, message: '관리자 권한이 필요합니다.' },
				{ status: 200 }
			);
		}

		// 관련 데이터 삭제
		await db.collection('contents').deleteOne({ _id: new ObjectId(contentId as string) });

		// 이미지 삭제
		if (content.images.length > 0) {
			await s3Delete(content.images);
		}

		return NextResponse.json(
			{ success: true, message: '콘텐츠를 삭제했습니다.' },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json({ success: false, message: `${err}` }, { status: 500 });
	}
}
