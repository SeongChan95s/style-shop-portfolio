import { connectDB } from '@/app/utils/db/database';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { regPassword } from '@/app/constants';
import { UserDB } from '@/app/types/next-auth';

export async function POST(request: NextRequest) {
	try {
		const { email, password, passwordConfirm } = await request.json();

		if (!email || !password || !passwordConfirm) {
			return NextResponse.json(
				{ success: false, message: '모든 필드를 입력해주세요.' },
				{ status: 400 }
			);
		}

		if (password !== passwordConfirm) {
			return NextResponse.json(
				{ success: false, message: '비밀번호가 일치하지 않습니다.' },
				{ status: 400 }
			);
		}

		// 비밀번호 유효성 검사
		if (!regPassword.test(password)) {
			return NextResponse.json(
				{ success: false, message: '비밀번호는 영문 숫자 조합 8자리 이상 작성해주세요.' },
				{ status: 400 }
			);
		}

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const etcCollection = db.collection('etc');

		// 인증 상태 확인
		const resetData = await etcCollection.findOne({
			email,
			name: 'password_reset',
			verified: true
		});

		if (!resetData) {
			return NextResponse.json(
				{ success: false, message: '인증되지 않은 요청입니다.' },
				{ status: 400 }
			);
		}

		// 만료 시간 확인 (인증 후 10분)
		if (new Date() > new Date(resetData.expiredAt)) {
			// 만료된 데이터 삭제
			await etcCollection.deleteOne({ email, name: 'password_reset' });
			return NextResponse.json(
				{
					success: false,
					message: '인증 시간이 만료되었습니다. 처음부터 다시 진행해주세요.'
				},
				{ status: 400 }
			);
		}

		// 비밀번호 해시화
		const hashedPassword = await bcrypt.hash(password, 10);

		// 사용자 비밀번호 업데이트
		const usersCollection = db.collection<UserDB>('users');
		const updateResult = await usersCollection.updateOne(
			{ email },
			{ $set: { password: hashedPassword } }
		);

		if (updateResult.matchedCount === 0) {
			return NextResponse.json(
				{ success: false, message: '사용자를 찾을 수 없습니다.' },
				{ status: 404 }
			);
		}

		// 사용된 인증 데이터 삭제
		await etcCollection.deleteOne({ email, name: 'password_reset' });

		return NextResponse.json(
			{ success: true, message: '비밀번호가 성공적으로 변경되었습니다.' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('비밀번호 변경 오류:', error);
		return NextResponse.json(
			{ success: false, message: '서버 오류가 발생했습니다.' },
			{ status: 500 }
		);
	}
}
