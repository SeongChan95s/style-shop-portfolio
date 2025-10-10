'use client';

import { Button } from '@/app/components/common/Button';
import { deleteOrder } from '@/app/services/order/deleteOrder';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

interface DeleteOrderButtonProps {
	orderId: string;
}

export default function DeleteOrderButton({ orderId }: DeleteOrderButtonProps) {
	const router = useRouter();

	const { mutate, isPending } = useMutation({
		mutationFn: () => deleteOrder(orderId),
		onSuccess: () => {
			alert('주문내역이 삭제되었습니다.');
			router.push('/user/order');
		},
		onError: (error: Error) => {
			alert(error.message || '주문내역 삭제에 실패했습니다.');
		}
	});

	const handleDelete = () => {
		if (confirm('주문내역을 삭제하시겠습니까?')) {
			mutate();
		}
	};

	return (
		<Button variant="outlined" size="sm" fill onClick={handleDelete} disabled={isPending}>
			{isPending ? '삭제 중...' : '주문 내역 삭제'}
		</Button>
	);
}
