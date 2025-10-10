'use server';

import { connectDB } from '@/app/utils/db/database';
import { getSession } from '../auth/authActions';
import bcrypt from 'bcrypt';

export const updateUserAction = async <T,>(initialData: T, formData: FormData) => {
	try {
		const toObjectFormData = Object.fromEntries(formData.entries());
		const session = await getSession();
		if (!session) return { success: false, message: '로그인이 필요합니다.' };

		if (toObjectFormData.password) {
			const hash = await bcrypt.hash(toObjectFormData.password as string, 10);
			toObjectFormData.password = hash;
		}

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		await db.collection('users').updateOne(
			{ email: session.user.email },
			{
				$set: toObjectFormData
			}
		);

		return { success: true, message: '회원정보를 수정했습니다.' };
	} catch (error) {
		return { success: false, message: `회원정보 수정에 실패했습니다. ${error}` };
	}
};
