import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/utils/db/database';
import { completeProfileSchema } from '@/app/lib/zod/schemas/auth';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		if (!body.provider || !body.providerId) {
			return NextResponse.json({
				success: false,
				message: '필수 정보가 누락되었습니다.'
			});
		}
		const validationResult = completeProfileSchema.safeParse({
			email: body.email,
			name: body.name
		});
		if (!validationResult.success) {
			const firstError = validationResult.error.issues[0];
			return NextResponse.json({
				success: false,
				message: firstError.message,
				field: firstError.path[0]
			});
		}

		const { email, name } = validationResult.data;
		const { provider, providerId } = body;

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const usersCollection = db.collection('users');
		const accountsCollection = db.collection('accounts');

		const existingUserByEmail = await usersCollection.findOne({ email });
		if (existingUserByEmail) {
			return NextResponse.json({
				success: false,
				message: '이미 사용 중인 이메일입니다.'
			});
		}

		const account = await accountsCollection.findOne({
			provider,
			providerAccountId: providerId
		});

		// 등록된 어카운트인지 확인
		if (account) {
			await usersCollection.updateOne(
				{ _id: account.userId },
				{
					$set: {
						email,
						name: name.trim(),
						emailVerified: new Date()
					}
				}
			);

			return NextResponse.json(
				{ success: true, message: '회원가입에 성공했습니다.' },
				{ status: 200 }
			);
		} else {
			// 없다면 새 사용자 생성
			const newUser = {
				name: name.trim(),
				email,
				image: null,
				emailVerified: new Date(),
				role: 'user'
			};

			const userResult = await usersCollection.insertOne(newUser);

			const newAccount = {
				userId: userResult.insertedId,
				type: 'oauth',
				provider,
				providerAccountId: providerId,
				access_token: null,
				refresh_token: null,
				expires_at: null,
				token_type: null,
				scope: null,
				id_token: null,
				session_state: null
			};

			await accountsCollection.insertOne(newAccount);

			return NextResponse.json(
				{ success: true, message: '회원가입에 성공했습니다.' },
				{ status: 200 }
			);
		}
	} catch (error) {
		console.error('정보 등록 오류:', error);
		return NextResponse.json(
			{ success: false, message: '서버 오류가 발생했습니다.' },
			{ status: 500 }
		);
	}
}
