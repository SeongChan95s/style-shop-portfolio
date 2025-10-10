'use client';

import { Button } from '@/app/components/common/Button';
import { useQuery } from '@tanstack/react-query';
import { Select } from '@/app/components/common/Select';
import { useRouter } from 'next/navigation';
import { getOrder } from '@/app/services/order/getOrder';
import styles from './../../order.module.scss';

interface DeliveryProps {
	orderId: string;
}

export default function Delivery({ orderId }: DeliveryProps) {
	const {
		data: getOrderResult,
		isError: getOrderIsError,
		isPending: getOrderIsPending
	} = useQuery({
		queryFn: () => getOrder(orderId),
		queryKey: ['order', orderId]
	});

	const router = useRouter();

	const handleChangeAddress = () => {
		router.push(`/order/process/address?orderId=${orderId}`);
	};

	if (getOrderIsPending) return <></>;

	if (getOrderIsError) return <></>;
	if (!getOrderResult.success) return <></>;

	const address = getOrderResult.data?.address;

	return (
		<section className={`sectionLayoutLg ${styles.delivery}`}>
			<div className={`inner ${styles.wrap}`}>
				<h3 className="hidden">배송 정보</h3>

				<header className={styles.header}>
					<p className={styles.name}>{address.name}</p>
					<Button variant="outlined" size="xxs" onClick={handleChangeAddress}>
						배송지 변경
					</Button>
				</header>
				<div className={styles.body}>
					<p className={styles.post}>
						({address.post.code}) {address.post.road} {address.post.detail}
					</p>
					<p className={styles.tel}>{address.tel}</p>

					<Select
						className={styles.select}
						name="address.request"
						variant="outlined"
						size="sm"
						fill>
						<Select.Input placeholder="배송 요청사항을 선택해주세요." />
						<Select.Container>
							<Select.Option value="문 앞에 놓아주세요">문 앞에 놓아주세요</Select.Option>
							<Select.Option value="경비실에 맡겨주세요">경비실에 맡겨주세요</Select.Option>
							<Select.Option value="택배함에 넣어주세요">택배함에 넣어주세요</Select.Option>
							<Select.Option value="배송 전에 연락주세요">배송 전에 연락주세요</Select.Option>
							<Select.Option value="직접 입력" enableTextField>직접 입력</Select.Option>
						</Select.Container>
					</Select>
				</div>
			</div>
		</section>
	);
}
