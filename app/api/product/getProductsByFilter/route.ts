import { connectDB } from '@/app/utils/db/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		const client = await connectDB;
		const db = client.db(process.env.MONGODB_NAME);
		const searchParams = req.nextUrl.searchParams;
		const size = Number(searchParams.get('size'));
		const filter = JSON.parse(searchParams.get('filter') as string);

		const products = await db
			.collection('products')
			.aggregate([
				{
					$sample: { size }
				},
				{
					$match: filter
				}
			])
			.toArray();

		if (products.length < 1) {
			return NextResponse.json({ message: '상품 정보가 없습니다.' }, { status: 404 });
		}

		return NextResponse.json(products, { status: 200 });
	} catch (err) {
		return NextResponse.json({ message: `${err}` }, { status: 500 });
	}
}
