'use client';

import { IconHeartFilled, IconHeartOutlined } from '../common/Icon';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { HTTPError } from '@/app/services/HTTPError';
import { useSession } from '../../providers/SessionProvider';
import { IconButton } from '../common/IconButton';
import styles from './WishButton.module.scss';
import { toggleWish } from '@/app/services/wish/toggleWish';
import { getWishStatusByIdAndSession } from '@/app/services/wish/getWishStatusByIdAndSession';
import { useSystemAlertStore } from '@/app/store';

interface WishButtonProps {
	size?: 'sm' | 'md' | 'lg';
	variant?: 'standard' | 'thumb';
	targetId: string;
	name: string;
	label?: boolean;
	className?: string;
}

export default function WishButton({
	targetId,
	size = 'md',
	variant = 'standard',
	name,
	label = false,
	className = ''
}: WishButtonProps) {
	const queryClient = useQueryClient();
	const session = useSession();
	const { data: getWishResult, isSuccess: getWishIsSuccess } = useQuery({
		queryKey: ['wish', targetId, name],
		queryFn: () => getWishStatusByIdAndSession(name, targetId),
		enabled: session ? true : false
	});

	let isAdded = getWishResult?.success ? getWishResult.data.entry : false;

	const wishMutation = useMutation({
		mutationFn: toggleWish,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['wish', name],
				refetchType: 'all'
			});
			queryClient.invalidateQueries({ queryKey: ['wish', targetId, name] });
		},
		onError: (error: HTTPError) => {
			error.showAlert();
		},
		onSettled: result => {
			isAdded = !isAdded;
			if (result.message) useSystemAlertStore.getState().push(result.message);
		}
	});

	const isAddedClass =
		getWishResult && getWishResult.success && getWishResult.data.entry
			? styles.isAdded
			: '';

	return (
		<IconButton
			className={`${styles.wishButton} ${styles[size]} ${styles[variant]} ${isAddedClass} ${className}`}
			feedback
			onClick={e => {
				e.preventDefault();
				e.stopPropagation();
				wishMutation.mutate({
					name,
					targetId
				});
			}}>
			{isAdded && getWishIsSuccess ? (
				<IconHeartFilled className={`${styles.icon} active`} />
			) : (
				<IconHeartOutlined className={`${styles.icon}`} />
			)}
			{label && (
				<span className={styles.label}>
					{getWishResult?.success ? getWishResult?.data?.count : 0}
				</span>
			)}
		</IconButton>
	);
}
