import { connectDB } from '@/app/utils/db/database';
import { NextResponse } from 'next/server';

async function createDatabaseIndexes() {
	try {
		const client = await connectDB;
		const db = client.db(process.env.MONGODB_NAME);

		// 일반 인덱싱 (키워드)
		await db
			.collection('productGroups')
			.createIndex({ keywords: 1 }, { name: 'keywords_index' });

		// 자연어 검색 인덱싱 (상품명, 브랜드명, 키워드)
		await db.collection('productGroups').createIndex(
			{
				name: 'text',
				brand: 'text',
				keywords: 'text'
			},
			{
				weights: {
					name: 5,
					brand: 3,
					keywords: 1
				},
				name: 'search_index',
				background: true,
				default_language: 'none'
			}
		);

		// 금액 인덱싱
		await db.collection('productGroups').createIndex(
			{
				'price.cost': 1
			},
			{ name: 'cost_index', background: true }
		);

		const indexes = await db.collection('productGroups').listIndexes().toArray();
		indexes.forEach((index, i) => {
			console.log(`  ${i + 1}. ${index.name}: ${JSON.stringify(index.key)}`);
		});

		return { success: true, message: '인덱스 생성 완료', indexes };
	} catch (error) {
		return { success: false, message: `인덱스 생성 실패: ${error}` };
	}
}

async function checkIndexStatus() {
	try {
		const client = await connectDB;
		const db = client.db(process.env.MONGODB_NAME);

		const indexes = await db.collection('productGroups').listIndexes().toArray();
		const stats = await db.command({ collStats: 'productGroups' });

		return {
			success: true,
			indexes,
			indexSizes: stats.indexSizes,
			totalIndexSize: stats.totalIndexSize
		};
	} catch (error) {
		return { success: false, message: `인덱스 상태 확인 실패: ${error}` };
	}
}

async function dropIndex(indexName: string) {
	try {
		const client = await connectDB;
		const db = client.db(process.env.MONGODB_NAME);

		await db.collection('productGroups').dropIndex(indexName);

		return { success: true, message: `인덱스 삭제 완료: ${indexName}` };
	} catch (error) {
		return { success: false, message: `인덱스 삭제 실패: ${error}` };
	}
}

export async function POST() {
	try {
		const result = await createDatabaseIndexes();

		if (result.success) {
			return NextResponse.json(result, { status: 200 });
		} else {
			return NextResponse.json(result, { status: 500 });
		}
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: `인덱스 생성 실패: ${error}` },
			{ status: 500 }
		);
	}
}

export async function GET() {
	try {
		const result = await checkIndexStatus();
		return NextResponse.json(result, { status: 200 });
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: `인덱스 상태 확인 실패: ${error}` },
			{ status: 500 }
		);
	}
}

export async function DELETE(request: Request) {
	try {
		const body = await request.json();
		const { indexName } = body;

		const client = await connectDB;
		const db = client.db(process.env.MONGODB_NAME);

		if (!indexName) {
			const indexes = await db.collection('productGroups').listIndexes().toArray();
			const toDelete = indexes.map(idx => idx.name).filter(name => name !== '_id_');

			for (const name of toDelete) {
				await db.collection('productGroups').dropIndex(name);
			}

			return NextResponse.json(
				{ success: true, message: '모든 인덱스 삭제 완료', deleted: toDelete },
				{ status: 200 }
			);
		}

		const result = await dropIndex(indexName);

		if (result.success) {
			return NextResponse.json(
				{ success: true, message: `${indexName} 인덱스 삭제 완료` },
				{ status: 200 }
			);
		} else {
			return NextResponse.json(result, { status: 500 });
		}
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: `인덱스 삭제 실패: ${error}` },
			{ status: 500 }
		);
	}
}
