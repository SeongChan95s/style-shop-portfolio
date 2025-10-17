import { getSession } from '@/app/actions/auth/authActions';
import { updateUserSchema } from '@/app/lib/zod/schemas/user';
import { connectDB } from '@/app/utils/db/database';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { UserDB } from '@/app/types/next-auth';

export async function PUT(request: NextRequest) {
	const formData = await request.formData();
	const formDataObject = Object.fromEntries(formData);

	const session = await getSession();
	if (!session) return { success: false, message: '로그인이 필요합니다.' };

	const validation = updateUserSchema.safeParse(formDataObject);

	if (!validation.success)
		return NextResponse.json({
			success: false,
			message: validation.error.issues[0].message
		});

	let data = {
		name: validation.data.name,
		tel: validation.data.tel
	} as UserDB;
	if (validation.data.password != '')
		data = {
			...data,
			password: await bcrypt.hash(validation.data.password as string, 10)
		};

	const db = (await connectDB).db(process.env.MONGODB_NAME);
	await db.collection('users').updateOne(
		{ email: session.user.email },
		{
			$set: data
		}
	);

	return NextResponse.json({
		success: true,
		message: '테스트 성공'
	});
}
