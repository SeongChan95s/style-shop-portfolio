import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/utils/db/database';
import { ProductItemCollection } from '@/app/types';
import { s3Delete } from '@/app/services/s3';

export async function DELETE(req: NextRequest) {
	try {
		const { targetImages } = await req.json();
		if (!targetImages || !Array.isArray(targetImages)) {
			return NextResponse.json(
				{ success: false, message: '삭제할 이미지 배열이 필요합니다.' },
				{ status: 400 }
			);
		}

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const search = await db
			.collection<ProductItemCollection>('productItems')
			.find(
				{ images: { $in: targetImages } },
				{ projection: { images: { $elemMatch: { $in: targetImages } } } }
			)
			.toArray();
		const imagesToDelete = targetImages.filter(
			img =>
				search.filter(doc => Array.isArray(doc.images) && doc.images.includes(img))
					.length === 1
		);

		await Promise.all(imagesToDelete.map(img => s3Delete(img)));

		return NextResponse.json({ success: true, message: '이미지를 삭제했습니다.' });
	} catch (error) {
		return NextResponse.json({ success: false, message: `${error}` }, { status: 500 });
	}
}
