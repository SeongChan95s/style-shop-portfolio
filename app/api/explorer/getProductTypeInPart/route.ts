import { connectDB } from '@/app/utils/db/database';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const db = (await connectDB).db(process.env.MONGODB_NAME);

		const categoryData = await db.collection('productGroups').distinct('category');

		const categoryByPart: Record<string, string[]> = {};

		categoryData.forEach((item: Record<string, string>) => {
			const { part, type } = item;
			if (!categoryByPart[part]) {
				categoryByPart[part] = [];
			}
			if (!categoryByPart[part].includes(type)) {
				categoryByPart[part].push(type);
			}
		});

		return NextResponse.json(
			{ success: true, message: `성공`, data: categoryByPart },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ success: false, message: `${error}` }, { status: 500 });
	}
}
