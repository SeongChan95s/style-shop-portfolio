import { getSession } from '@/app/actions/auth/authActions';
import { Address, User } from '@/app/types';
import dotFormDataToObject from '@/app/utils/convert/dotFormDataToObject';
import { connectDB } from '@/app/utils/db/database';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const formDataObject = dotFormDataToObject<Address<string | undefined>>(formData);
		const addressId = formDataObject._id
			? new ObjectId(formDataObject._id)
			: new ObjectId();
		const address: Address<ObjectId> = {
			...formDataObject,
			_id: addressId
		};

		const session = await getSession();
		if (!session)
			return NextResponse.json(
				{ success: false, message: `로그인이 필요합니다` },
				{ status: 200 }
			);

		const db = (await connectDB).db(process.env.MONGODB_NAME);

		const user = await db.collection<User>('users').findOne({
			email: session.user.email
		});
		if (!user)
			return NextResponse.json(
				{ success: false, message: `유저와 일치하는 정보가 없습니다` },
				{ status: 400 }
			);

		const isNotExistedAddressId = !user?.address?.some(
			id => id.toString() === address._id.toString()
		);

		if (isNotExistedAddressId) {
			await db.collection<User>('users').updateOne(
				{
					email: session.user?.email
				},
				{
					$push: { address: address._id }
				}
			);
		}

		if (address.default === true) {
			await db.collection<Address<ObjectId>>('address').updateMany(
				{
					_id: { $in: user.address, $ne: address._id }
				},
				{
					$set: { default: false }
				}
			);
		}

		await db.collection<Address<ObjectId>>('address').updateOne(
			{
				_id: address._id
			},
			{
				$set: address
			},
			{ upsert: true }
		);

		return NextResponse.json(
			{ success: true, message: '주소를 저장했습니다.' },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ success: false, message: `${error}` }, { status: 500 });
	}
}
