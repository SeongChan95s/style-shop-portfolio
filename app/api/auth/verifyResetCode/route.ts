import { connectDB } from '@/app/utils/db/database';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	try {
		const { email, code } = await request.json();

		if (!email || !code) {
			return NextResponse.json(
				{ success: false, message: '이메일과 인증번호를 입력해주세요.' },
				{ status: 400 }
			);
		}

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const etcCollection = db.collection('etc');

		// etc 컬렉션에서 해당 이메일의 코드 확인
		const resetData = await etcCollection.findOne({
			email,
			name: 'password_reset'
		});

		if (!resetData) {
			return NextResponse.json(
				{ success: false, message: '인증번호 요청 기록이 없습니다.' },
				{ status: 404 }
			);
		}

		// 만료 시간 확인
		if (new Date() > new Date(resetData.expiredAt)) {
			// 만료된 데이터 삭제
			await etcCollection.deleteOne({ email, name: 'password_reset' });
			return NextResponse.json(
				{ success: false, message: '인증번호가 만료되었습니다. 다시 요청해주세요.' },
				{ status: 400 }
			);
		}

		// 코드 일치 확인
		if (resetData.code !== code) {
			return NextResponse.json(
				{ success: false, message: '인증번호가 일치하지 않습니다.' },
				{ status: 400 }
			);
		}

		// 인증 성공 - verified 상태로 업데이트
		await etcCollection.updateOne(
			{ email, name: 'password_reset' },
			{ $set: { verified: true, verifiedAt: new Date() } }
		);

		return NextResponse.json(
			{ success: true, message: '인증번호가 확인되었습니다.' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('인증번호 확인 오류:', error);
		return NextResponse.json(
			{ success: false, message: '서버 오류가 발생했습니다.' },
			{ status: 500 }
		);
	}
}
