'use client';

import AddressList from '@/app/components/user/AddressList';
import { SubmitBar } from '@/app/components/global/AppBar';
import { updateOrder } from '@/app/services/order/updateOrder';
import { Address } from '@/app/types';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getOrder } from '@/app/services/order/getOrder';

export default function OrderProcessAddressPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const orderId = searchParams.get('orderId');
	if (!orderId) notFound();

	const {
		data: getOrderResult,
		isError: getOrderIsError,
		isPending: getOrderIsPending
	} = useQuery({
		queryFn: () => getOrder(orderId),
		queryKey: ['order', orderId]
	});

	const queryClient = useQueryClient();
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const { address: addressString } = Object.fromEntries(formData) as {
			address: string;
		};
		const address = JSON.parse(addressString) as Address<string>;

		const result = await updateOrder({ _id: orderId, address: address });

		if (result.success) {
			queryClient.invalidateQueries({ queryKey: ['order'] });
			router.back();
		}
	};

	if (getOrderIsError) return <></>;
	if (getOrderIsPending) return <></>;

	return (
		<section className="sectionLayoutLg">
			<div className="inner">
				<form method="put" onSubmit={handleSubmit}>
					<AddressList
						radio
						defaultCheckAddressId={
							getOrderResult?.success ? getOrderResult.data.address?._id : ''
						}
					/>
					<SubmitBar label="변경하기" />
				</form>
			</div>
		</section>
	);
}
