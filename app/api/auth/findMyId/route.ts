import { findMyIdSchema } from '@/app/lib/zod/schemas/auth';
import { UserDB } from '@/app/types/next-auth';
import { connectDB } from '@/app/utils/db/database';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	const formData = await request.formData();
	const formDataObject = Object.fromEntries(formData);

	const validation = findMyIdSchema.safeParse(formDataObject);

	if (!validation.success) {
		return NextResponse.json({
			success: false,
			message: validation.error.issues[0].message
		});
	}

	const db = (await connectDB).db(process.env.MONGODB_NAME);
	const result = await db.collection('users').findOne<UserDB>(validation.data);

	if (!result)
		return NextResponse.json({
			success: false,
			message: '아이디를 찾을 수 없습니다.'
		});

	return NextResponse.json({
		success: true,
		message: '테스트 성공',
		data: result?.email
	});
}
