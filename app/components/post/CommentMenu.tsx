'use client';

import { useRouter } from 'next/navigation';
import { IconMoreVertical } from '../common/Icon';
import { Menu } from '../common/Menu';

interface Props {
	commentId: string;
	isAuthor: boolean;
	className?: string;
}

export default function CommentMenu({ commentId, isAuthor, className }: Props) {
	const router = useRouter();

	const handleDeleteComment = async () => {
		const res = await fetch('/api/comment/deleteComment', {
			method: 'DELETE',
			body: JSON.stringify({ commentId })
		});
		const result = await res.json();

		if (res.ok) {
			router.refresh();
		} else {
			alert(result.message);
		}
	};

	return (
		<Menu className={className}>
			<Menu.Trigger
				Component={
					<button>
						<IconMoreVertical size="sm" />
					</button>
				}
			/>
			<Menu.Container>
				<Menu.Item>숨기기</Menu.Item>
				{!isAuthor && (
					<Menu.Item onClick={() => alert('신고가 완료되었습니다.')}>신고하기</Menu.Item>
				)}
				{isAuthor && <Menu.Item onClick={handleDeleteComment}>삭제하기</Menu.Item>}
			</Menu.Container>
		</Menu>
	);
}
