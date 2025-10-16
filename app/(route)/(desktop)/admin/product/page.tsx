'use client';

import { ProductNested } from '@/app/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Button } from '@/app/components/common/Button';
import { searchProducts } from '@/app/services/explorer';
import { useRouter } from 'next/navigation';
import { Table, TableColumn } from '@/app/components/common/Table';
import styles from './../admin.module.scss';

const TABLE_COLUMNS: TableColumn[] = [
	{ field: 'id', value: '_id', width: 100 },
	{ field: '상품명', value: 'name', width: 300 },
	{ field: '브랜드', value: 'brand', width: 120 },
	{ field: '분류', value: 'category.main', width: 40 },
	{ field: '성별', value: 'category.gender', width: 40 },
	{ field: '파츠', value: 'category.part', width: 60 },
	{ field: '타입', value: 'category.type', width: 120 },
	{
		field: '원가',
		value: 'price.cost',
		width: 90,
		transform: (value: unknown) =>
			typeof value === 'number' ? value.toLocaleString() + '원' : ''
	},
	{
		field: '할인율',
		value: 'price.discount',
		width: 50,
		transform: (value: unknown) => (typeof value === 'number' ? value + '%' : '')
	},
	{
		field: '조회수',
		value: 'totalView',
		width: 50,
		transform: (value: unknown) =>
			typeof value === 'number' ? value.toLocaleString() : ''
	}
];

export default function AdminProductPage() {
	const router = useRouter();

	const limit = { group: 10 };

	const [search, _setSearch] = useState('');

	const { data, isPending, isError, hasNextPage, fetchNextPage } = useInfiniteQuery({
		queryFn: async ({ pageParam: skip }) => searchProducts({ search, limit, skip }),
		queryKey: ['product', search],
		initialPageParam: 0,
		getNextPageParam: (lastPage, pages) => {
			if (lastPage.success && lastPage.data.length < limit.group) {
				return undefined;
			}
			return pages.length * limit.group;
		}
	});

	if (isPending) {
		return (
			<div className={styles.productListPage}>
				<header>
					<h3>상품 목록</h3>
				</header>
				<div>로딩 중...</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className={styles.productListPage}>
				<header>
					<h3>상품 목록</h3>
				</header>
				<div>데이터를 불러오는데 실패했습니다.</div>
			</div>
		);
	}

	const products = data.pages.flatMap(page => (page.success ? page.data : []));

	const onClickRow = (product: ProductNested) => {
		router.push(`/admin/product/edit/${product._id}`);
	};

	const handleAddProductGroup = (e: React.MouseEvent) => {
		e.preventDefault();
		router.push('/admin/product/edit/new');
	};

	return (
		<div className={styles.productListPage}>
			<header>
				<h3>상품 목록</h3>
			</header>
			<Table data={products} columns={TABLE_COLUMNS} onClickRow={onClickRow} />
			{hasNextPage && <Button onClick={() => fetchNextPage()}>더보기</Button>}

			<Button size="sm" onClick={handleAddProductGroup}>
				상품 추가
			</Button>
		</div>
	);
}
