'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getReviews } from '@/app/services/review/getReviews';
import { useEffect, useRef, useState } from 'react';
import { Link } from '@/app/components/common/Link';
import { classNames } from '@/app/utils';
import Image from 'next/image';
import { WishButton } from '@/app/components/wish';
import styles from './feed.module.scss';
import { Skeleton } from '@/app/components/common/Skeleton';
import { Select } from '@/app/components/common/Select';
import { IconButton } from '@/app/components/common/IconButton';
import {
	IconGridCol1,
	IconGridRow2,
	IconGridRow2Col2,
	IconShare
} from '@/app/components/common/Icon';
import { Document } from 'mongodb';

type SortOption = 'latest' | 'oldest' | 'comments';

const SORT_OPTIONS = {
	latest: { label: '최신순', value: { timestamp: -1 } },
	oldest: { label: '오래된순', value: { timestamp: 1 } },
	comments: { label: '댓글순', value: { comment: -1 } }
} as const;

export default function Timeline() {
	const [grid, setGrid] = useState<'col3' | 'col2' | 'col1'>('col3');
	const [sort, setSort] = useState<Document>({ timestamp: -1 });

	const limit = 3;
	const { data, isLoading, isError, isFetchingNextPage, hasNextPage, fetchNextPage } =
		useInfiniteQuery({
			queryFn: ({ pageParam: skip }) =>
				getReviews({
					match: {
						$expr: {
							$gte: [{ $size: { $ifNull: ['$content.images', []] } }, 1]
						}
					},
					sort,
					limit,
					skip
				}),
			queryKey: ['review', sort, limit],
			initialPageParam: 0,
			getNextPageParam: (lastPage, pages) => {
				if (lastPage.success && lastPage.data.length < limit) {
					return undefined;
				}
				return pages.length * limit;
			}
		});

	const infiniteLoaderRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const target = infiniteLoaderRef.current;
		const observer = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
					fetchNextPage();
				}
			});
		});
		if (target) observer.observe(target);

		return () => {
			if (target) observer.unobserve(target);
		};
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

	const handleSortChange = (value: string) => {
		const sortKey = Object.entries(SORT_OPTIONS).find(
			([_, option]) => option.label === value
		)?.[0] as SortOption;

		if (sortKey) {
			setSort(SORT_OPTIONS[sortKey].value);
		}
	};

	const handleChangeGrid = () => {
		switch (grid) {
			case 'col3':
				setGrid('col2');
				break;
			case 'col2':
				setGrid('col1');
				break;
			case 'col1':
				setGrid('col3');
				break;
		}
	};

	const handleShare = (reviewId: string, text: string) => () => {
		if (navigator.share) {
			navigator.share({
				title: `${text}`,
				url: `${process.env.NEXT_PUBLIC_CLIENT_URL}/review/details/${reviewId}`
			});
		}
	};

	if (isError) return <></>;

	const pages = data?.pages.filter(page => page.success);
	const reviews = pages && pages.flatMap(page => page.data);
	const className = classNames(styles.timeline, styles[grid]);

	return (
		<div className={className}>
			<div className={styles.viewControl}>
				<Select
					className={styles.selectSort}
					size="xs"
					variant="filled"
					defaultValue="최신순"
					onChange={handleSortChange}>
					<Select.Input />
					<Select.Container>
						{Object.values(SORT_OPTIONS).map(option => (
							<Select.Option key={option.label} value={String(option.label)}>
								{option.label}
							</Select.Option>
						))}
					</Select.Container>
				</Select>

				<IconButton className={styles.grid} size="sm" onClick={handleChangeGrid}>
					{
						{
							col3: <IconGridRow2Col2 />,
							col2: <IconGridRow2 />,
							col1: <IconGridCol1 />
						}[grid]
					}
				</IconButton>
			</div>

			<div className={styles.contents}>
				{reviews?.map((review) => (
					<Link
						href={`/review/details/${review._id}`}
						className={styles.card}
						key={review._id}>
						<div className={styles.thumbnail}>
							<Image
								src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${review.content.images[0]}`}
								fill
								sizes="30vw"
								alt="썸네일"
							/>
							<WishButton
								className={styles.wishButton}
								targetId={review._id}
								name="review"
								variant="thumb"
							/>
						</div>
						<div className={styles.container}>
							<div className={styles.actions}>
								<WishButton targetId={review._id} name="review" label />
								<IconButton
									size="md"
									onClick={handleShare(review._id, review.content.text)}>
									<IconShare />
								</IconButton>
							</div>
							<p className={styles.text}>{review.content.text}</p>
						</div>
					</Link>
				))}
				{(isLoading || isFetchingNextPage) && <Skeleton variant="rect" />}
				{hasNextPage && (
					<div className={styles.dataLoadObserver} ref={infiniteLoaderRef}></div>
				)}
			</div>
		</div>
	);
}
