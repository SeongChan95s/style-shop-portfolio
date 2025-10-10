'use client';

import Link from 'next/link';
import { Badge } from '../common/Badge';
import { IconBagOutlined } from '../common/Icon';
import { useQuery } from '@tanstack/react-query';
import { IconButton } from '../common/IconButton';
import { useSession } from '@/app/providers';
import styles from './CartButton.module.scss';

interface CartButtonProps {
	className: string;
}

export default function CartButton({ className }: CartButtonProps) {
	const isLogin = useSession() ? true : false;

	const getCartCount = async () => {
		const response = await fetch(`/api/cart/getCartCountByUser`);

		if (!response.ok) return 0;
		return response.json();
	};

	const { data: count } = useQuery<number>({
		queryKey: ['cart'],
		queryFn: getCartCount,
		staleTime: 1000 * 600,
		enabled: isLogin
	});

	return (
		<Badge count={count}>
			<Link href="/cart" className={`${styles.button} ${className}`}>
				<IconButton size="lg" feedback>
					<IconBagOutlined className={styles.buttonCart} />
				</IconButton>
			</Link>
		</Badge>
	);
}
