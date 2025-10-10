import { connectDB } from '@/app/utils/db/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const collection = searchParams.get('collection');
		const match = searchParams.get('match');
		if (!collection || !match)
			return NextResponse.json(
				{
					success: false,
					error: '콜렉션명 및 match 조건이 필요합니다.'
				},
				{ status: 400 }
			);
		const matchPipe = JSON.parse(match);

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const result = await db.collection(collection).find(matchPipe).toArray();

		return NextResponse.json({
			success: true,
			message: '데이터를 가져왔습니다.',
			data: result
		});
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				message: `${error}`
			},
			{ status: 500 }
		);
	}
}
