import { OrderProducts } from '@/app/types';

export const translateOrderStatus = (status: OrderProducts['status']): string => {
	const statusMap: Record<OrderProducts['status'], string> = {
		'order-progress': '주문서 작성중',
		receive: '주문접수',
		shipped: '배송중',
		completed: '배송완료',
		'return-request': '반품요청',
		'return-processing': '반품중',
		'return-completed': '반품완료',
		confirmed: '구매확정'
	};
	return statusMap[status];
};
