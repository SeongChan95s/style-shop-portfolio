'use client';

import { Brand } from '@/app/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Button } from '@/app/components/common/Button';
import { getBrands } from '@/app/services/brand/getBrands';
import { useRouter } from 'next/navigation';
import { Table, TableColumn } from '@/app/components/common/Table';
import styles from './../admin.module.scss';

const TABLE_COLUMNS: TableColumn[] = [
	{ field: 'id', value: '_id', width: 100 },
	{ field: '브랜드명', value: 'name.main', width: 100 },
	{ field: '소개', value: 'desc', width: 250 },
	{ field: '국가', value: 'country', width: 30 },
	{
		field: '좋아요 수',
		value: 'wishUsers',
		width: 50,
		transform: (value: unknown) => (Array.isArray(value) ? value.length : 0)
	}
];

export default function AdminBrandPage() {
	const router = useRouter();

	const limit = 30;

	const [search, _setSearch] = useState('');

	const { data, isPending, isError, hasNextPage, fetchNextPage } = useInfiniteQuery({
		queryFn: async ({ pageParam: skip }) => getBrands({ skip, limit }),
		queryKey: ['brand', search],
		initialPageParam: 0,
		getNextPageParam: (lastPage, pages) => {
			if (lastPage.success && lastPage.data.length < limit) {
				return undefined;
			}
			return pages.length * limit;
		}
	});

	if (isPending || isError) return <></>;

	const brands = data.pages.flatMap(page => (page.success ? page.data : []));

	const onClickRow = (brand: Brand) => {
		router.push(`/admin/brand/edit/${brand._id}`);
	};

	const handleAddBrand = (e: React.MouseEvent) => {
		e.preventDefault();
		router.push('/admin/brand/edit/new');
	};

	return (
		<div className={styles.brandListPage}>
			<header>
				<h3>브랜드 목록</h3>
			</header>
			<Table data={brands} columns={TABLE_COLUMNS} onClickRow={onClickRow} />
			{hasNextPage && <Button onClick={() => fetchNextPage()}>더보기</Button>}

			<Button size="sm" onClick={handleAddBrand}>
				브랜드 추가
			</Button>
		</div>
	);
}
