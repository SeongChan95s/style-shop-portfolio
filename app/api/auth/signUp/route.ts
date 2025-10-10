import bcrypt from 'bcrypt';
import { connectDB } from '@/app/utils/db/database';
import { NextRequest, NextResponse } from 'next/server';
import { regEmail, regPassword } from '@/app/constants';

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		let { password } = body;
		const { email, name } = body;

		// 이메일 유효성 검사
		if (!regEmail.test(email))
			return NextResponse.json(
				{ message: '올바른 이메일 형식이 아닙니다.' },
				{ status: 400 }
			);

		// 이메일 중복 확인
		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const existingUsername = await db.collection('users').findOne({ email });

		if (existingUsername) {
			return NextResponse.json(
				{ message: '이미 사용 중인 이메일 입니다.' },
				{ status: 400 }
			);
		}

		// 비밀번호 확인
		if (!regPassword.test(password))
			return NextResponse.json(
				{ message: '비밀번호는 영문 숫자 조합 8자리 이상 작성해주세요.' },
				{ status: 400 }
			);
		const hash = await bcrypt.hash(password, 10);
		password = hash;

		// 닉네임 중복 확인
		const existingNickname = await db.collection('users').findOne({ name });

		if (existingNickname) {
			return NextResponse.json(
				{ message: '이미 사용 중인 닉네임입니다.' },
				{ status: 409 }
			);
		}

		await db.collection('users').insertOne({
			email,
			password,
			name,
			role: 'user'
		});

		return NextResponse.json({ message: '회원가입에 성공했습니다.' }, { status: 200 });
	} catch (err) {
		return NextResponse.json({ message: `${err}` }, { status: 500 });
	}
}
