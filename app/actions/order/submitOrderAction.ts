'use server';

import { getOrder } from '@/app/services/order/getOrder';
import { updateOrder } from '@/app/services/order/updateOrder';
import dotFormDataToObject from '@/app/utils/convert/dotFormDataToObject';
import { merge } from 'lodash';
import { cookies } from 'next/headers';

interface OrderFormData {
	orderId: string;
	address: {
		request?: string;
	};
	payment?: {
		method?: string;
	};
}

export interface UpdateOrderActionState {
	success: boolean;
	message: string;
}

export const submitOrderAction = async (
	_prev: UpdateOrderActionState,
	formData: FormData
): Promise<UpdateOrderActionState> => {
	try {
		const formDataObject = dotFormDataToObject<OrderFormData>(formData);
		if (!formDataObject.payment?.method)
			return {
				success: false,
				message: '결제수단을 선택해주세요.'
			};

		const cookie = await cookies();
		const decodedCookie = decodeURIComponent(cookie.toString());
		const order = await getOrder(formDataObject.orderId, decodedCookie);
		if (!order.success)
			return {
				success: false,
				message: '일치하는 주문정보가 없습니다.'
			};

		const mergedOrder = merge(order.data, {
			address: {
				request: formDataObject.address.request
			},
			payment: {
				...formDataObject.payment
			},
			status: 'receive'
		});

		await updateOrder(mergedOrder, decodedCookie);

		return {
			success: true,
			message: '주문을 완료했습니다.'
		};
	} catch (error) {
		return {
			success: false,
			message: `${error}`
		};
	}
};
