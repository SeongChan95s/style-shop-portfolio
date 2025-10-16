'use client';

import { Magazine } from '@/app/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Button } from '@/app/components/common/Button';
import { getContents } from '@/app/services/contents/getContents';
import { useRouter } from 'next/navigation';
import { Table, TableColumn } from '@/app/components/common/Table';
import styles from './../../admin.module.scss';

const TABLE_COLUMNS: TableColumn[] = [
	{ field: 'id', value: '_id', width: 100 },
	{ field: '이름', value: 'name', width: 150 },
	{ field: '제목', value: 'title', width: 200 },
	{
		field: '본문',
		value: 'body',
		width: 300,
		transform: (value: unknown) => {
			if (typeof value === 'string') {
				return value.length > 50 ? value.substring(0, 50) + '...' : value;
			}
			return '';
		}
	},
	{
		field: '키워드',
		value: 'keywords',
		width: 200,
		transform: (value: unknown) => {
			if (Array.isArray(value)) {
				return value.join(', ');
			}
			return '';
		}
	}
];

export default function AdminMagazinePage() {
	const router = useRouter();

	const limit = 10;

	const [search, _setSearch] = useState('');

	const { data, isPending, isError, hasNextPage, fetchNextPage } = useInfiniteQuery({
		queryFn: async ({ pageParam: skip }) =>
			getContents<Magazine>({ skip, limit, match: { name: '매거진' } }),
		queryKey: ['magazine', search],
		initialPageParam: 0,
		getNextPageParam: (lastPage, pages) => {
			if (lastPage.success && lastPage.data.length < limit) {
				return undefined;
			}
			return pages.length * limit;
		}
	});

	if (isPending) {
		return (
			<div className={styles.brandListPage}>
				<header>
					<h3>매거진 목록</h3>
				</header>
				<div>로딩 중...</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className={styles.brandListPage}>
				<header>
					<h3>매거진 목록</h3>
				</header>
				<div>데이터를 불러오는데 실패했습니다.</div>
			</div>
		);
	}

	const magazines = data.pages.flatMap(page => (page.success ? page.data : []));

	const onClickRow = (magazine: Magazine) => {
		router.push(`/admin/content/magazine/edit/${magazine._id}`);
	};

	const handleAddMagazine = (e: React.MouseEvent) => {
		e.preventDefault();
		router.push('/admin/content/magazine/edit/new');
	};

	return (
		<div className={styles.brandListPage}>
			<header>
				<h3>매거진 목록</h3>
			</header>
			<Table data={magazines} columns={TABLE_COLUMNS} onClickRow={onClickRow} />
			{hasNextPage && <Button onClick={() => fetchNextPage()}>더보기</Button>}

			<Button size="sm" onClick={handleAddMagazine}>
				매거진 추가
			</Button>
		</div>
	);
}
