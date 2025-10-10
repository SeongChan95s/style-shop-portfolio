'use server';

import { Order, ProductNested } from '@/app/types';
import { updateOrder } from '@/app/services/order/updateOrder';
import dotFormDataToObject from '@/app/utils/convert/dotFormDataToObject';
import { isEqual, pick } from 'lodash';
import { cookies } from 'next/headers';

export interface ChangeOptionActionState {
	success: boolean;
	message: string;
}

export async function changeOptionAction(
	prev: ChangeOptionActionState,
	formData: FormData
): Promise<ChangeOptionActionState> {
	try {
		const orderDataString = formData.get('orderData') as string;
		const orderProductsDataString = formData.get('orderProductsData') as string;
		const targetProductString = formData.get('targetProduct') as string;

		if (!orderDataString || !orderProductsDataString || !targetProductString) {
			return {
				success: false,
				message: '필수 정보가 누락되었습니다.'
			};
		}

		const orderData = JSON.parse(orderDataString);
		const orderProductsData = JSON.parse(orderProductsDataString) as (ProductNested & {
			count: number;
		})[];
		const targetProduct = JSON.parse(targetProductString) as ProductNested & {
			count: number;
		};
		const formDataObject = dotFormDataToObject(formData);

		const optionKeys = targetProduct.items[0]
			? Object.keys(targetProduct.items[0].option)
			: [];

		const selectedProduct: ProductNested & { count: number } = {
			...targetProduct,
			count: (formDataObject as { count: number }).count || 1,
			items: [
				...targetProduct.items.sort(item => {
					return isEqual(item.option, pick(formDataObject as object, optionKeys))
						? -1
						: 1;
				})
			]
		};

		if (!selectedProduct.items[0]?._id) {
			return {
				success: false,
				message: '선택한 옵션의 상품을 찾을 수 없습니다.'
			};
		}

		const newOrderProduct: Order<string>['products'][0] = {
			productItemId: selectedProduct.items[0]._id,
			count: selectedProduct.count
		};
		const existProducts = orderProductsData.map(el => ({
			productItemId: el.items[0]._id,
			count: el.count
		}));

		const currentOrderProductIds = existProducts.map(p => p.productItemId);
		const targetProductItemIds = targetProduct.items.map(item => item._id);
		const currentTargetProductId = currentOrderProductIds.find(id =>
			targetProductItemIds.includes(id)
		);
		const productsToChange: Order<string>['products'] = [
			...existProducts.filter(el => el.productItemId !== currentTargetProductId),
			newOrderProduct
		];

		const cookie = await cookies();
		const decodedCookie = cookie.toString();
		const result = await updateOrder(
			{
				...orderData,
				products: productsToChange
			},
			decodedCookie
		);

		if (!result || !result.success) {
			return {
				success: false,
				message: `${result.message} 이유로 주문 변경에 실패했습니다.`
			};
		}

		return {
			success: true,
			message: '옵션이 변경되었습니다.'
		};
	} catch (error) {
		return {
			success: false,
			message: `${error}`
		};
	}
}
