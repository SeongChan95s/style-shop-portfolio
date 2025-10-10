import { Review } from '@/app/types';
import { connectDB } from '@/app/utils/db/database';
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;

		const search = searchParams.get('search') ?? '';
		const searchWords = search
			.trim()
			.split(' ')
			.filter(word => word.trim() !== '');
		const matchParam = searchParams.get('match');
		const match = matchParam ? JSON.parse(matchParam) : {};

		// _id를 ObjectId로 변환
		if (match._id && typeof match._id === 'string') {
			match._id = new ObjectId(match._id);
		}

		const matchPipe =
			searchWords.length > 0
				? [
						{
							$match: {
								$or: searchWords.map(word => ({
									'content.text': { $regex: word, $options: 'iu' }
								})),
								...match
							}
						}
					]
				: [{ $match: match }];

		const skipParam = searchParams.get('skip');
		const skipPipe = skipParam ? [{ $skip: parseInt(skipParam) }] : [];

		const limitParam = searchParams.get('limit');
		const limitPipe = limitParam ? [{ $limit: JSON.parse(limitParam) }] : [];

		const sortParam = searchParams.get('sort');
		const sortPipe = sortParam ? [{ $sort: JSON.parse(sortParam) }] : [];

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const reviews = await db
			.collection('reviews')
			.aggregate<Review>([
				{
					$lookup: {
						from: 'users',
						localField: 'userEmail',
						foreignField: 'email',
						as: 'author'
					}
				},
				{
					$unwind: '$author' // 각 배열 데이터에 대해
				},
				{
					$project: {
						'author.password': 0
					}
				},
				...matchPipe,
				...sortPipe,
				...skipPipe,
				...limitPipe
			])
			.toArray();

		return NextResponse.json(
			{ success: true, message: '리뷰를 가져왔습니다.', data: reviews },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json({ success: false, message: `${err}` }, { status: 500 });
	}
}
