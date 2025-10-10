'use client';

import { Button } from '@/app/components/common/Button';
import { signIn, signOut } from 'next-auth/react';
import styles from './my.module.scss';

interface LoginModeProps {
	label: string;
	variant: 'outlined' | 'filled';
	onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function LoginButton({ isLogin }: { isLogin: boolean }) {
	const loginModeProps: LoginModeProps = isLogin
		? {
				label: 'LOGOUT',
				variant: `outlined`,
				onClick: () => signOut()
			}
		: {
				label: 'LOGIN',
				variant: 'filled',
				onClick: () => signIn()
			};

	return (
		<Button
			className={styles.loginButton}
			fill
			variant={loginModeProps.variant}
			onClick={loginModeProps.onClick}>
			{loginModeProps.label}
		</Button>
	);
}
