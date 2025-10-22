'use client';

import { Switch } from '@/app/components/common/Switch';
import { IconArrowTrim, IconSettingOutlined } from '@/app/components/common/Icon';
import { IconButton } from '@/app/components/common/IconButton';
import { useState } from 'react';
import { Button } from '@/app/components/common/Button';
import { Select } from '../common/Select';
import { ProductCard } from '../product';
import ReviewCard from './ReviewCard';
import { Review } from '@/app/types';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Document } from 'mongodb';
import { useSession } from '@/app/providers';
import { getReviewsByProductId } from '@/app/services/review';
import { getOrdersProductsBySession } from '@/app/services/order/getOrdersProductsBySession';
import styles from './ReviewList.module.scss';

type SortOption = 'latest' | 'oldest' | 'comments';
type FilterType = 'images' | 'custom';

interface ReviewFilters {
	hasImages: boolean;
	customFilter: boolean;
}

interface ReviewListProps {
	productGroupId: string;
	productItemId: string;
}

const SORT_OPTIONS = {
	latest: { label: '최신순', value: { timestamp: -1 } },
	oldest: { label: '오래된순', value: { timestamp: 1 } },
	comments: { label: '댓글순', value: { comment: -1 } }
} as const;

const IMAGE_FILTER_QUERY = {
	$expr: {
		$gte: [{ $size: { $ifNull: ['$content.images', []] } }, 1]
	}
};

interface FilterControlsProps {
	filters: ReviewFilters;
	onToggleFilter: (filterType: FilterType) => void;
	onSortChange: (value: string) => void;
}

function FilterControls({ filters, onToggleFilter, onSortChange }: FilterControlsProps) {
	return (
		<div className={styles.filterMenu}>
			<Switch
				size="sm"
				checked={filters.customFilter}
				onChange={() => onToggleFilter('custom')}>
				맞춤 필터
			</Switch>

			<Switch
				size="sm"
				checked={filters.hasImages}
				onChange={() => onToggleFilter('images')}>
				사진 후기
			</Switch>

			<div className={styles.right}>
				<Select
					className={styles.selectSort}
					size="sm"
					variant="filled"
					defaultValue="최신순"
					onChange={onSortChange}>
					<Select.Input />
					<Select.Container>
						{Object.values(SORT_OPTIONS).map(option => (
							<Select.Option key={option.label} value={String(option.label)}>
								{option.label}
							</Select.Option>
						))}
					</Select.Container>
				</Select>

				<IconButton className={styles.filterButton}>
					<IconSettingOutlined />
				</IconButton>
			</div>
		</div>
	);
}

export default function ReviewList({ productGroupId, productItemId }: ReviewListProps) {
	const router = useRouter();
	const pathname = usePathname();
	const session = useSession();
	const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
	const [sort, setSort] = useState<Document>({ timestamp: -1 });
	const [filters, setFilters] = useState<ReviewFilters>({
		hasImages: false,
		customFilter: false
	});

	const { data: ordersData } = useQuery({
		queryFn: () => getOrdersProductsBySession(),
		queryKey: ['orders', 'user'],
		enabled: !!session
	});

	const buildMatchQuery = (): Document => {
		const matchQuery: Document = {};
		if (filters.hasImages) {
			Object.assign(matchQuery, IMAGE_FILTER_QUERY);
		}
		return matchQuery;
	};

	const matchQuery = buildMatchQuery();
	const limit = 4;

	const {
		data: reviewData,
		isFetching,
		isSuccess,
		hasNextPage,
		fetchNextPage
	} = useInfiniteQuery({
		queryFn: async ({ pageParam: skip }) =>
			getReviewsByProductId({
				groupId: productGroupId,
				match: matchQuery,
				sort,
				limit,
				skip
			}),
		queryKey: ['review', productGroupId, sort, matchQuery],
		initialPageParam: 0,
		getNextPageParam: (lastPage, pages) => {
			if (!lastPage.success) {
				return undefined;
			}
			if (lastPage.data.length < limit) {
				return undefined;
			}
			return pages.length * limit;
		}
	});

	const handleSortChange = (value: string) => {
		const sortKey = Object.entries(SORT_OPTIONS).find(
			([_, option]) => option.label === value
		)?.[0] as SortOption;

		if (sortKey) {
			setSort(SORT_OPTIONS[sortKey].value);
		}
	};

	const toggleFilter = (filterType: FilterType) => {
		setFilters(prev => ({
			...prev,
			[filterType === 'images' ? 'hasImages' : 'customFilter']:
				!prev[filterType === 'images' ? 'hasImages' : 'customFilter']
		}));
	};

	const handleCreateReview = () => {
		if (session) {
			const purchasedOrder = ordersData?.success
				? ordersData.data
						.flatMap(order =>
							order.products.map(product => ({
								orderId: order._id,
								productItemId: product.items[0]._id,
								hasReview: product.items[0].hasReview
							}))
						)
						.find(item => item.productItemId === productItemId && !item.hasReview)
				: null;

			if (purchasedOrder) {
				router.push(
					`/review/edit/new?orderId=${purchasedOrder.orderId}&itemId=${productItemId}&callbackUrl=${encodeURIComponent(pathname)}`
				);
			}
		} else {
			signIn();
		}
	};

	// 사용자가 해당 상품을 구매했고 리뷰를 작성하지 않았는지 확인
	const canWriteReview = ordersData?.success
		? ordersData.data.some(order =>
				order.products.some(product =>
					product.items.some(item => item._id === productItemId && !item.hasReview)
				)
			)
		: false;

	const isAuthor = (authorEmail: string) => authorEmail === session?.user?.email;

	const pages = reviewData?.pages.filter(page => page.success);
	const reviews = pages && pages.flatMap(page => page.data);

	const totalReviews =
		(reviewData?.pages?.[0]?.success && reviewData?.pages?.[0]?.data?.length) || 0;
	const isEmpty = isSuccess && totalReviews === 0;

	return (
		<div className={styles.reviewList}>
			<FilterControls
				filters={filters}
				onToggleFilter={toggleFilter}
				onSortChange={handleSortChange}
			/>

			<ul className={styles.postList}>
				{reviews?.map((review: Review<string>) => (
					<ReviewCard
						key={review._id}
						wrap={selectedReviewId === review._id}
						isAuthor={isAuthor(review.author.email)}
						review={review}
						onClick={() =>
							setSelectedReviewId(selectedReviewId === review._id ? null : review._id)
						}
					/>
				))}
				{isFetching && (
					<>
						{Array.from({ length: 2 }, (_, i) => (
							<li key={i} className="inner">
								<ProductCard.Skeleton direction="horizontal" />
							</li>
						))}
					</>
				)}
			</ul>

			<div className={styles.buttonWrap}>
				{hasNextPage && (
					<button
						className={`button ${styles.moreButton}`}
						onClick={() => fetchNextPage()}>
						더보기
						<IconArrowTrim size="sm" />
					</button>
				)}

				{canWriteReview && (
					<Button variant="outlined" size="lg" fill onClick={handleCreateReview}>
						<span>
							{isEmpty
								? '이 상품의 첫번째 리뷰를 작성해보세요.'
								: '리뷰 작성 시 최대 1,500 point를 드립니다.'}
						</span>
					</Button>
				)}
			</div>
		</div>
	);
}
