'use server';

import { connectDB } from '@/app/utils/db/database';
import { getSession } from '../auth/authActions';
import { FetchResponse } from '@/app/types';

export const addSearchAction = async (search: string): Promise<FetchResponse> => {
	try {
		const db = (await connectDB).db(process.env.MONGODB_NAME);

		const session = await getSession();
		if (!session)
			return {
				success: false,
				message: '로그인되지 않아 서버에 검색어가 기록되지 않습니다.'
			};
		const userEmail = session?.user.email;

		const timestamp = new Date().getTime();

		if (search == '')
			return {
				success: false,
				message: '검색어가 입력되지 않았습니다.'
			};

		await db
			.collection('search')
			.findOneAndUpdate(
				{ userEmail, search },
				{ $set: { search, timestamp } },
				{ upsert: true }
			);

		return {
			success: true,
			message: '검색로그에 추가했습니다.'
		};
	} catch (error) {
		return { success: false, message: `검색로그 추가에 실패했습니다. ${error}` };
	}
};
