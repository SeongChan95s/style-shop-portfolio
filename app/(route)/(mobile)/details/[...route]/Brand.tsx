'use client';

import {
	IconArrowTrim,
	IconHeartFilled,
	IconHeartOutlined
} from '@/app/components/common/Icon';
import { IconButton } from '@/app/components/common/IconButton';
import { getBrands } from '@/app/services/brand/getBrands';
import { useSystemAlertStore } from '@/app/store';
import {
	useQueryClient,
	useMutation,
	useSuspenseQuery,
	useQuery
} from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import styles from './details.module.scss';
import { useSession } from '@/app/providers';
import { getWishStatusByIdAndSession } from '@/app/services/wish/getWishStatusByIdAndSession';
import { toggleWish } from '@/app/services/wish/toggleWish';

export default function Brand({ name }: { name: string }) {
	const session = useSession();
	const { data: getBrandResult } = useSuspenseQuery({
		queryFn: () => getBrands({ match: { 'name.main': name } }),
		queryKey: ['brand', name]
	});

	const { data: getWishResult } = useQuery({
		queryFn: () =>
			getWishStatusByIdAndSession(
				'brand',
				getBrandResult.success ? getBrandResult.data[0]._id : ''
			),
		queryKey: ['brand', 'wish', name],
		enabled: getBrandResult.success
	});

	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: toggleWish,
		onSuccess: result => {
			if (result.success) useSystemAlertStore.getState().push(result.message);
			queryClient.invalidateQueries({ queryKey: ['brand', 'wish', name] });
		},
		onError: result => {
			console.error(result.message);
		}
	});

	const router = useRouter();
	const handleBrandLink = () => {
		if (brand) router.push(`/brand/${brand._id}`);
	};

	const brand = getBrandResult.success ? getBrandResult.data[0] : null;

	return (
		<div className={styles.brand}>
			<div className="inner">
				<div className={styles.brandName} onClick={handleBrandLink}>
					<span>{name}</span>
					{brand && <IconArrowTrim />}
				</div>

				{brand && (
					<div className={styles.wish}>
						{session && getWishResult?.success && getWishResult?.data?.entry ? (
							<IconButton
								size="sm"
								className={styles.iconButtonFilled}
								onClick={() => mutation.mutate({ name: 'brand', targetId: brand._id })}>
								<IconHeartFilled />
							</IconButton>
						) : (
							<IconButton
								size="sm"
								className={styles.iconButtonOutlined}
								onClick={() => mutation.mutate({ name: 'brand', targetId: brand._id })}>
								<IconHeartOutlined />
							</IconButton>
						)}

						<span>{brand?.wishUsers?.length ?? 0}</span>
					</div>
				)}
			</div>
		</div>
	);
}
