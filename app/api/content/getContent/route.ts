import { connectDB } from '@/app/utils/db/database';
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const match = searchParams.get('match');
		const search = searchParams.get('search');
		const limit = searchParams.get('limit');
		const sort = searchParams.get('sort');
		const skip = searchParams.get('skip');

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const collection = db.collection('contents');

		let query = {};

		if (match) {
			const matchObj = JSON.parse(match);
			if (matchObj._id) {
				matchObj._id = new ObjectId(matchObj._id);
			}
			query = { ...query, ...matchObj };
		}

		if (search) {
			query = {
				...query,
				$or: [
					{ name: { $regex: search, $options: 'i' } },
					{ title: { $regex: search, $options: 'i' } }
				]
			};
		}

		let cursor = collection.find(query);

		if (sort) {
			cursor = cursor.sort(JSON.parse(sort));
		}

		if (skip) {
			cursor = cursor.skip(Number(skip));
		}

		if (limit) {
			cursor = cursor.limit(Number(limit));
		}

		const data = await cursor.toArray();

		return NextResponse.json(
			{
				success: true,
				message: '콘텐츠를 조회했습니다.',
				data
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ success: false, message: `${error}` }, { status: 500 });
	}
}
