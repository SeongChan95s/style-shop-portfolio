'use client';

import { Brand } from '@/app/types';
import {
	IconHeartOutlined,
	IconHeartFilled,
	IconShare
} from '@/app/components/common/Icon';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HTTPError } from '@/app/services/HTTPError';
import { useSession } from '@/app/providers/SessionProvider';
import { useEffect, useState } from 'react';
import { useSystemAlertStore } from '@/app/store';
import { IconButton } from '@/app/components/common/IconButton';
import { shareUrl } from '@/app/utils/seo';
import { getWishStatusByIdAndSession } from '@/app/services/wish/getWishStatusByIdAndSession';
import { addWish } from '@/app/services/wish';
import styles from './brand.module.scss';

interface BrandHeaderProps {
	brand: Brand;
}

export default function BrandHeader({ brand }: BrandHeaderProps) {
	const queryClient = useQueryClient();
	const session = useSession();
	const [isWished, setIsWished] = useState(false);

	const { data: getWishResult } = useQuery({
		queryKey: ['brand', brand._id],
		queryFn: () => getWishStatusByIdAndSession('brand', brand._id),
		enabled: !!session
	});

	useEffect(() => {
		if (getWishResult && getWishResult.success && getWishResult.data) {
			setIsWished(getWishResult.data.entry);
		}
	}, [getWishResult]);

	const wishMutation = useMutation({
		mutationFn: () => addWish('brand', brand._id),
		onMutate: async () => {
			setIsWished(!isWished);
		},
		onSuccess: result => {
			queryClient.invalidateQueries({
				queryKey: ['brand', brand._id]
			});
			if (result.success && result.data?.entry !== undefined) {
				setIsWished(result.data.entry);
			}
		},
		onError: (error: HTTPError) => {
			setIsWished(!isWished);
			error.showAlert();
		}
	});

	const handleWishToggle = () => {
		if (!session) {
			useSystemAlertStore.getState().push('로그인이 필요합니다.');
			return;
		}
		wishMutation.mutate();
	};

	const handleShare = () => {
		shareUrl(brand.name.main, brand.desc);
	};

	const isWishedClass = isWished ? styles.wish : '';

	return (
		<header className={styles.brandHeader}>
			<div className={styles.coverImage}>
				{brand.images[1] ? (
					<div className={styles.imageWrap}>
						<Image
							src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${brand.images[1]}`}
							alt={brand.name.main}
							fill
						/>
					</div>
				) : (
					<div className={styles.empty}></div>
				)}

				<div className={styles.overlay} />
			</div>

			<div className={styles.brandInfo}>
				<div className={styles.titleBox}>
					{brand.images[0] && (
						<div className={styles.logo}>
							<Image
								src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${brand.images[0]}`}
								alt={brand.name.main}
								fill
							/>
						</div>
					)}
					<div className={styles.title}>
						<h3 className={styles.mainName}>{brand.name.main}</h3>
						{brand.name.sub && <p className={styles.subName}>{brand.name.sub}</p>}
					</div>
				</div>

				<div className={styles.actions}>
					<IconButton onClick={handleShare} className={styles.shareButton}>
						<IconShare />
					</IconButton>
					<IconButton
						onClick={handleWishToggle}
						className={`${styles.wishButton} ${isWishedClass}`}>
						{isWished ? <IconHeartFilled /> : <IconHeartOutlined />}
					</IconButton>
				</div>
			</div>
		</header>
	);
}
