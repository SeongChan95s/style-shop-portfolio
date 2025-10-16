'use client';

import { useRouter } from 'next/navigation';
import { Button } from '../common/Button';
import { useQuery } from '@tanstack/react-query';
import { getAddressBySession } from '@/app/services/user/getAddressBySession';
import { Flag } from '../common/Flag';
import styles from './AddressList.module.scss';
import { RadioButton } from '../common/RadioButton';

interface UserAddressProps {
	radio?: boolean;
	defaultCheckAddressId?: string;
}

export default function AddressList({
	radio = false,
	defaultCheckAddressId
}: UserAddressProps) {
	const router = useRouter();

	const { data, isError, isPending } = useQuery({
		queryFn: () => getAddressBySession(),
		queryKey: ['user', 'address']
	});

	const handleEditAddress = (id: string) => (_e: React.MouseEvent) => {
		router.push(`/user/address/edit/${id}`);
	};

	if (isError || isPending || !data.success) return <></>;

	let addresses = data.data;
	const addressToCheck =
		defaultCheckAddressId && defaultCheckAddressId !== ''
			? addresses.find(ad => ad._id == defaultCheckAddressId)
			: addresses.find(ad => ad.default);

	addresses = addresses.sort((a) =>
		a._id.toString() == addressToCheck?._id ? -1 : 0
	);

	return (
		<div className={styles.addressList}>
			<Button variant="outlined" fill onClick={() => router.push('/user/address/edit')}>
				배송지 추가하기
			</Button>

			<ul className={styles.addressWrap}>
				{addresses.map((address, i) => (
					<li className={styles.addressCard} key={`addressCard_${i}`}>
						{radio && (
							<RadioButton
								name="address"
								value={JSON.stringify(address)}
								defaultChecked={JSON.stringify(addressToCheck) == JSON.stringify(address)}
								shape="round"
							/>
						)}

						<div className={styles.container}>
							<div className={styles.cardHeader}>
								<p className={styles.name}>{address.name}</p>
								{address.default && (
									<Flag variant="filled" size="md">
										기본배송지
									</Flag>
								)}
							</div>
							<div className={styles.cardbody}>
								<p>
									({address.post.code}) {address.post.road} {address.post.detail}
								</p>
								<p>{address.tel}</p>
								<Button
									size="xxs"
									variant="outlined"
									onClick={handleEditAddress(address._id)}>
									수정
								</Button>
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
