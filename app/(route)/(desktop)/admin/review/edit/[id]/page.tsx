'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import ReviewForm from './ReviewForm';
import { Review } from '@/app/types';
import { getReviews } from '@/app/services/review/getReviews';

export default function ReviewEditPage() {
	const params = useParams();
	const reviewId = params.id as string;
	const isNew = reviewId === 'new';

	const { data, isPending, isError } = useQuery({
		queryFn: () => getReviews({ match: { _id: reviewId } }),
		queryKey: ['review', reviewId],
		enabled: !isNew
	});

	if (isPending && !isNew) {
		return (
			<div className="inner">
				<div>리뷰 정보를 불러오는 중...</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="inner">
				<div>리뷰를 찾을 수 없습니다.</div>
			</div>
		);
	}

	return (
		<ReviewForm
			initialReview={data && data.success ? data.data[0] : undefined}
			isNew={isNew}
		/>
	);
}
