import { connectDB } from '@/app/utils/db/database';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;

	const match = JSON.parse(searchParams.get('match') as string);
	if (match?._id) match._id = new ObjectId(match._id as string);
	const matchPipe = match ? [{ $match: match }] : [];

	const sort = searchParams.get('sort');
	const sortPipe = sort ? [{ $sort: JSON.parse(sort) }] : [];

	const skip = searchParams.get('skip') as string;
	const skipPipe = skip ? [{ $skip: parseInt(skip) }] : [];

	const limit = searchParams.get('limit');
	const limitPipe = limit ? [{ $limit: parseInt(limit) }] : [];

	const db = (await connectDB).db(process.env.MONGODB_NAME);
	const brands = await db
		.collection('brands')
		.aggregate([...matchPipe, ...sortPipe, ...skipPipe, ...limitPipe])
		.toArray();

	if (brands.length == 0)
		return NextResponse.json(
			{ success: false, data: brands, message: '브랜드 정보가 없습니다.' },
			{ status: 200 }
		);

	return NextResponse.json(
		{ success: true, data: brands, message: '브랜드 정보를 불러왔습니다.' },
		{ status: 200 }
	);
}
