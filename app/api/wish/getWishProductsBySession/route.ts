import { getSession } from '@/app/actions/auth/authActions';
import { ProductItemCollection, ProductNested, Wish } from '@/app/types';
import { connectDB } from '@/app/utils/db/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		const searchParams = req.nextUrl.searchParams;
		const limitParam = searchParams.get('limit');
		const limit = limitParam ? [{ $limit: JSON.parse(limitParam) }] : [];

		const skipParam = searchParams.get('skip');
		const skip = skipParam ? [{ $skip: parseInt(skipParam) }] : [];

		const sortParam = searchParams.get('sort');
		const sort = sortParam ? [{ $sort: JSON.parse(sortParam) }] : [];

		const session = await getSession();
		if (!session)
			return NextResponse.json({
				success: false,
				message: '로그인이 필요합니다.'
			});

		const db = (await connectDB).db(process.env.MONGODB_NAME);

		const wishes = await db
			.collection<Wish>('wishes')
			.find({ userEmail: session.user.email })
			.toArray();

		const wishedTargetsId = wishes.map(wish => wish.targetId);

		const result = await db
			.collection<ProductItemCollection>('productItems')
			.aggregate<ProductNested>([
				{ $match: { _id: { $in: wishedTargetsId } } },
				{
					$lookup: {
						from: 'productGroups',
						localField: 'groupId',
						foreignField: '_id',
						as: 'group'
					}
				},
				{
					$unwind: '$group'
				},
				{
					$project: {
						_id: '$group._id',
						name: '$group.name',
						brand: '$group.brand',
						price: '$group.price',
						category: '$group.category',
						items: [
							{
								_id: '$_id',
								images: '$images',
								option: '$option'
							}
						]
					}
				},
				...sort,
				...skip,
				...limit
			])
			.toArray();

		const matchedItems = result.map(product => {
			const sortedResult = product.items.filter(a =>
				wishedTargetsId.includes(a._id) ? -1 : 1
			);
			return { ...product, items: sortedResult };
		});

		return NextResponse.json({ success: true, data: matchedItems }, { status: 200 });
	} catch (err) {
		return NextResponse.json({ message: `${err}` }, { status: 500 });
	}
}
