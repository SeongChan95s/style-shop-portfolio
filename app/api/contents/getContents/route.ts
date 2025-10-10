import { connectDB } from '@/app/utils/db/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;

		const match = JSON.parse(searchParams.get('match') as string);
		const search = searchParams.get('search') ?? '';
		const searchWords = search
			.trim()
			.split(' ')
			.filter(word => word.trim() !== '');

		const matchPipe =
			searchWords.length > 0
				? {
						$or: searchWords.map(word => ({
							$or: [
								{ body: { $regex: word, $options: 'iu' } },
								{ title: { $regex: word, $options: 'iu' } },
								{ keywords: { $regex: word, $options: 'iu' } }
							]
						})),
						...match
					}
				: (match ?? {});

		const skip: string | null | object[] = searchParams.get('skip');
		const skipPipe = skip ? [{ $skip: parseInt(skip) }] : [];

		const limit: string | null | object[] = searchParams.get('limit');
		const limitPipe = limit ? [{ $limit: JSON.parse(limit) }] : [];

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const contents = await db
			.collection('contents')
			.aggregate([{ $match: matchPipe }, ...skipPipe, ...limitPipe])
			.toArray();

		return NextResponse.json(
			{ success: true, data: contents, message: '컨텐츠를 가져왔습니다.' },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ success: false, message: `${error}` }, { status: 500 });
	}
}
