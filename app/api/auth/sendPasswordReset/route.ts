import { connectDB } from '@/app/utils/db/database';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { UserDB } from '@/app/types/next-auth';

export async function POST(request: NextRequest) {
	try {
		const { email } = await request.json();

		if (!email) {
			return NextResponse.json(
				{ success: false, message: '이메일을 입력해주세요.' },
				{ status: 400 }
			);
		}

		const db = (await connectDB).db(process.env.MONGODB_NAME);

		// 사용자 확인
		const usersCollection = db.collection<UserDB>('users');
		const user = await usersCollection.findOne({ email });

		if (!user) {
			return NextResponse.json(
				{ success: false, message: '존재하지 않는 이메일입니다.' },
				{ status: 404 }
			);
		}

		// 6자리 랜덤 코드 생성
		const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

		// 만료 시간 설정 (10분 후)
		const expiredAt = new Date(Date.now() + 10 * 60 * 1000);

		// etc 컬렉션에 저장
		const etcCollection = db.collection('etc');
		await etcCollection.updateOne(
			{ email },
			{
				$set: {
					email,
					code: resetCode,
					expiredAt,
					name: 'password_reset'
				}
			},
			{ upsert: true }
		);

		// 이메일 전송 설정
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASSWORD
			}
		});

		const mailOptions = {
			from: process.env.EMAIL_USER,
			to: email,
			subject: 'Style Shop 비밀번호 찾기',
			html: `
				<div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
					<h2 style="color: #333; text-align: center;">비밀번호 찾기</h2>
					<p>안녕하세요!</p>
					<p>요청하신 비밀번호 찾기 인증번호입니다.</p>
					<div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
						<h3 style="color: #007bff; font-size: 24px; margin: 0;">${resetCode}</h3>
					</div>
					<p style="color: #666;">이 인증번호는 10분간 유효합니다.</p>
					<p style="color: #666;">본인이 요청하지 않았다면 이 메일을 무시해주세요.</p>
				</div>
			`
		};

		await transporter.sendMail(mailOptions);

		return NextResponse.json(
			{ success: true, message: '인증번호가 이메일로 전송되었습니다.' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('비밀번호 찾기 오류:', error);
		return NextResponse.json(
			{ success: false, message: '서버 오류가 발생했습니다.' },
			{ status: 500 }
		);
	}
}
