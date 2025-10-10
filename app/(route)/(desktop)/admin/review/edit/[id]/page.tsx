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

	const emptyReview: Review<string> = {
		_id: '',
		content: {
			images: [],
			text: ''
		},
		score: 5,
		author: {
			_id: '',
			email: '',
			name: '',
			role: ''
		},
		timestamp: '',
		productItemId: '',
		productGroupId: '',
		orderId: '',
		comment: 0,
		wishUsers: [],
		viewUsers: []
	};

	const { data, isPending, isError } = useQuery({
		queryFn: () => getReviews({ match: { _id: reviewId } }),
		queryKey: ['review', reviewId],
		enabled: !!reviewId && !isNew
	});

	if (isNew) {
		return <ReviewForm initialReview={emptyReview} isNew={true} />;
	}

	if (isPending) {
		return (
			<div className="inner">
				<div>리뷰 정보를 불러오는 중...</div>
			</div>
		);
	}

	if (isError || !data?.success) {
		return (
			<div className="inner">
				<div>리뷰를 찾을 수 없습니다.</div>
			</div>
		);
	}

	return <ReviewForm initialReview={data.data[0]} isNew={false} />;
}
