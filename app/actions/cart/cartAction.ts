'use server';

import { CartsCollection, User } from '@/app/types';
import { formDataToObject } from '@/app/utils';
import { connectDB } from '@/app/utils/db/database';
import { ObjectId } from 'mongodb';
import { getSession } from '../auth/authActions';
import { deleteCartById } from '@/app/services/cart';
import { getDecodedServerCookie } from '@/app/utils/getServerCookie';
import { cookies } from 'next/headers';

type CartActionState =
	| { message: string; success: true; orderId: string }
	| { message: string; success: false; orderId: null }
	| { message: string; success: false; orderId: string; needConfirm: true };

export const cartAction = async (
	_state: CartActionState,
	formData: FormData
): Promise<CartActionState> => {
	try {
		const session = await getSession();
		if (!session)
			return { success: false, orderId: null, message: '로그인이 필요합니다.' };

		const formDataObject = formDataToObject<{ [key: string]: string }>(formData);
		const { confirmed, ...cartData } = formDataObject;

		const cartsId = Object.values(cartData).map(id => new ObjectId(id as string));

		const db = (await connectDB).db(process.env.MONGODB_NAME);
		const carts = await db
			.collection('carts')
			.aggregate<CartsCollection>([{ $match: { _id: { $in: cartsId } } }])
			.toArray();
		const productItems = carts.map(cart => ({
			productItemId: cart.productItemId,
			count: cart.count
		}));

		// 사용자의 기본 배송지 가져오기
		const defaultAddress = await db
			.collection<User>('users')
			.aggregate([
				{
					$match: {
						email: session.user.email
					}
				},
				{
					$lookup: {
						from: 'address',
						localField: 'address',
						foreignField: '_id',
						as: 'addresses'
					}
				},
				{
					$unwind: '$addresses'
				},
				{
					$match: {
						'addresses.default': true
					}
				},
				{
					$replaceRoot: {
						newRoot: '$addresses'
					}
				}
			])
			.toArray();

		const existOrder = await db.collection('orders').findOne({
			userEmail: session.user.email,
			status: 'order-progress'
		});

		// 주문정보가 존재하면
		if (existOrder) {
			if (confirmed === undefined) {
				return {
					success: false,
					orderId: existOrder._id.toString(),
					message: '진행중인 주문이 있습니다. 변경하시겠습니까?',
					needConfirm: true
				};
			}

			const cookie = await cookies();
			const promiseDeleteCart = cartsId.map(id => deleteCartById(id.toString(), cookie));
			await Promise.all(promiseDeleteCart);

			if (confirmed === 'yes') {
				await db.collection('orders').updateOne(
					{
						userEmail: session.user.email
					},
					{
						$set: {
							products: productItems,
							address: defaultAddress[0],
							status: 'order-progress',
							timestamp: new Date().getTime()
						}
					}
				);

				return {
					success: true,
					orderId: existOrder._id.toString(),
					message: '주문을 업데이트 했습니다.'
				};
			} else {
				return {
					success: true,
					orderId: existOrder._id.toString(),
					message: '기존 주문을 유지합니다.'
				};
			}
			// 주문정보가 없으면
		} else {
			const newId = new ObjectId();
			await db.collection('orders').insertOne({
				_id: newId,
				userEmail: session.user.email,
				products: productItems,
				address: defaultAddress[0],
				status: 'order-progress',
				timestamp: new Date().getTime()
			});

			return {
				success: true,
				orderId: newId.toString(),
				message: '주문정보를 저장했습니다.'
			};
		}
	} catch (error) {
		return {
			success: false,
			orderId: null,
			message: `${error}`
		};
	}
};
