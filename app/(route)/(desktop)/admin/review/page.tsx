'use client';

import { Review } from '@/app/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Button } from '@/app/components/common/Button';
import { getReviews } from '@/app/services/review/getReviews';
import { useRouter } from 'next/navigation';
import { Table, TableColumn } from '@/app/components/common/Table';
import styles from './../admin.module.scss';

const TABLE_COLUMNS: TableColumn[] = [
	{ field: 'id', value: '_id', width: 100 },
	{ field: '작성자', value: 'author.email', width: 150 },
	{ field: '상품ID', value: 'productItemId', width: 100 },
	{ field: '별점', value: 'score', width: 50 },
	{
		field: '리뷰 내용',
		value: 'content.text',
		width: 300,
		transform: (value: unknown) => {
			if (typeof value === 'string') {
				return value.length > 50 ? value.substring(0, 50) + '...' : value;
			}
			return '';
		}
	},
	{
		field: '작성일',
		value: 'timestamp',
		width: 100,
		transform: (value: unknown) => {
			if (typeof value === 'number') {
				return new Date(value).toLocaleDateString('ko-KR');
			}
			return '';
		}
	}
];

export default function AdminReviewPage() {
	const router = useRouter();

	const limit = 10;

	const [search, _setSearch] = useState('');

	const { data, isPending, isError, hasNextPage, fetchNextPage } = useInfiniteQuery({
		queryFn: async ({ pageParam: skip }) => getReviews({ skip, limit }),
		queryKey: ['review', search],
		initialPageParam: 0,
		getNextPageParam: (lastPage, pages) => {
			if (lastPage.success && lastPage.data.length < limit) {
				return undefined;
			}
			return pages.length * limit;
		}
	});

	if (isPending || isError) return <></>;

	const reviews = data.pages.flatMap(page => (page.success ? page.data : []));

	const onClickRow = (review: Review<string>) => {
		router.push(`/admin/review/edit/${review._id}`);
	};

	const handleAddReview = (e: React.MouseEvent) => {
		e.preventDefault();
		router.push('/admin/review/edit/new');
	};

	return (
		<div className={styles.brandListPage}>
			<header>
				<h3>리뷰 목록</h3>
			</header>
			<Table data={reviews} columns={TABLE_COLUMNS} onClickRow={onClickRow} />
			{hasNextPage && <Button onClick={() => fetchNextPage()}>더보기</Button>}

			<Button size="sm" onClick={handleAddReview}>
				리뷰 추가
			</Button>
		</div>
	);
}
