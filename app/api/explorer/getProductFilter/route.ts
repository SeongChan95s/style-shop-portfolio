import { connectDB } from '@/app/utils/db/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	try {
		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const searchParams = request.nextUrl.searchParams;
		const filterType = searchParams.get('filterType');
		let filter: object = {};

		if (filterType == 'category' || !filterType) {
			const categoryArray = await db
				.collection('productGroups')
				.aggregate<Record<string, string[]>>([
					{
						$project: {
							categoryEntries: { $objectToArray: '$category' }
						}
					},
					{ $unwind: '$categoryEntries' },
					{
						$group: {
							_id: '$categoryEntries.k',
							values: { $addToSet: '$categoryEntries.v' }
						}
					},
					{
						$replaceRoot: {
							newRoot: {
								$arrayToObject: [[{ k: '$_id', v: '$values' }]]
							}
						}
					}
				])
				.toArray();

			const category = categoryArray.reduce((acc, obj) => ({ ...acc, ...obj }), {});
			filter = { ...category };
		}

		if (filterType == 'option' || !filterType) {
			const optionArray = await db
				.collection('productItems')
				.aggregate([
					{
						$project: {
							optionEntries: { $objectToArray: '$option' }
						}
					},
					{ $unwind: '$optionEntries' },
					{
						$group: {
							_id: '$optionEntries.k',
							values: { $addToSet: '$optionEntries.v' }
						}
					},
					{
						$replaceRoot: {
							newRoot: {
								$arrayToObject: [[{ k: '$_id', v: '$values' }]]
							}
						}
					}
				])
				.toArray();

			const option = optionArray.reduce((acc, obj) => ({ ...acc, ...obj }), {});
			filter = { ...filter, ...option };
		}
		return NextResponse.json(
			{ success: true, message: `성공`, data: filter },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ success: false, message: `${error}` }, { status: 500 });
	}
}
