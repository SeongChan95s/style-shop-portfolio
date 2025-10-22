import { deleteReview } from '@/app/services/review';
import { useSystemAlertStore } from '@/app/store';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { IconMoreVertical } from '../common/Icon';
import { Menu } from '../common/Menu';

interface ReviewMenuProps extends React.HTMLAttributes<HTMLDivElement> {
	className?: string;
	productItemId: string;
	orderId: string;
	reviewId: string;
	isAuthor: boolean;
	size?: 'sm' | 'md' | 'lg';
	setIsVisible?: (state: boolean) => void;
}

export default function ReviewMenu({
	className = '',
	reviewId,
	size = 'md',
	isAuthor,
	productItemId,
	orderId,
	setIsVisible
}: ReviewMenuProps) {
	const router = useRouter();

	const pushAlert = useSystemAlertStore(state => state.push);

	const hideReview = () => {
		pushAlert('리뷰를 숨겼습니다.');
		setIsVisible?.(false);
	};

	const queryClient = useQueryClient();
	const handleDeleteReview = async () => {
		const response = await deleteReview(reviewId);
		pushAlert(response.message);
		if (response.success) queryClient.invalidateQueries({ queryKey: ['review'] });
	};

	return (
		<Menu className={className}>
			<Menu.Trigger
				Component={
					<button>
						<IconMoreVertical size={size} />
					</button>
				}
			/>
			<Menu.Container>
				{setIsVisible && <Menu.Item onClick={hideReview}>숨기기</Menu.Item>}

				{!isAuthor && (
					<Menu.Item onClick={() => alert('신고가 완료되었습니다.')}>신고하기</Menu.Item>
				)}
				{isAuthor && (
					<>
						<Menu.Item
							onClick={() =>
								router.push(`/review/edit/${productItemId}/${orderId}/${reviewId}`)
							}>
							수정하기
						</Menu.Item>
						<Menu.Item onClick={handleDeleteReview}>삭제하기</Menu.Item>
					</>
				)}
			</Menu.Container>
		</Menu>
	);
}
