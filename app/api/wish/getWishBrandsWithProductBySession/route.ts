import { getSession } from '@/app/actions/auth/authActions';
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

		const brandsWithProducts = await db
			.collection('wishes')
			.aggregate([
				{
					$match: {
						userEmail: session.user.email,
						name: 'brand'
					}
				},
				{
					$lookup: {
						from: 'brands',
						localField: 'targetId',
						foreignField: '_id',
						as: 'brandData'
					}
				},
				{
					$unwind: '$brandData'
				},
				{
					$lookup: {
						from: 'productGroups',
						localField: 'brandData.name.main',
						foreignField: 'brand',
						as: 'productGroups'
					}
				},
				{
					$unwind: {
						path: '$productGroups',
						preserveNullAndEmptyArrays: true
					}
				},
				{
					$lookup: {
						from: 'productItems',
						localField: 'productGroups._id',
						foreignField: 'groupId',
						as: 'productGroups.items'
					}
				},
				{
					$group: {
						_id: '$brandData._id',
						name: { $first: '$brandData.name' },
						desc: { $first: '$brandData.desc' },
						country: { $first: '$brandData.country' },
						since: { $first: '$brandData.since' },
						images: { $first: '$brandData.images' },
						wishUsers: { $first: '$brandData.wishUsers' },
						products: {
							$push: {
								$cond: [
									{ $ne: ['$productGroups', null] },
									{
										_id: '$productGroups._id',
										name: '$productGroups.name',
										brand: '$productGroups.brand',
										price: '$productGroups.price',
										category: '$productGroups.category',
										keywords: '$productGroups.keywords',
										items: '$productGroups.items'
									},
									'$$REMOVE'
								]
							}
						}
					}
				},
				{
					$project: {
						_id: 1,
						name: 1,
						desc: 1,
						country: 1,
						since: 1,
						images: 1,
						products: {
							$slice: ['$products', 5]
						}
					}
				},
				...sort,
				...skip,
				...limit
			])
			.toArray();

		return NextResponse.json(
			{ success: true, data: brandsWithProducts },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json({ message: `${err}` }, { status: 500 });
	}
}
