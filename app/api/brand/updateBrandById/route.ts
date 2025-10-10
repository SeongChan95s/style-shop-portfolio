'use server';

import { connectDB } from '@/app/utils/db/database';
import { omit } from 'lodash';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
	try {
		const body = await request.json();

		if (!body.images) body.images = [];

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		await db
			.collection('brands')
			.updateOne(
				{ _id: new ObjectId(body._id as string) },
				{ $set: omit(body, ['_id']) }
			);

		return NextResponse.json(
			{ success: true, message: '브랜드 정보를 업데이트 했습니다.' },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ success: false, message: `${error}` }, { status: 500 });
	}
}
