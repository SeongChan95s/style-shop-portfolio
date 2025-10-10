'use client';

import { Button } from '../common/Button';
import { signIn } from 'next-auth/react';
import { ClientSafeProvider } from '@/app/types/next-auth';
import styles from './SocialLoginButton.module.scss';

interface SocialLoginButtonProps {
	icon?: React.ReactElement;
	className?: string;
	provider: ClientSafeProvider;
	callbackUrl?: string;
}

export default function SocialLoginButton({
	className,
	icon,
	provider,
	callbackUrl
}: SocialLoginButtonProps) {
	return (
		<Button
			className={`${styles.socialLoginButton} ${className}`}
			type="button"
			variant="outlined"
			size="lg"
			onClick={() => {
				signIn(provider.id);
			}}
			fill
			icon={icon}>
			<span className={styles.label}>Sign in with {provider.name}</span>
		</Button>
	);
}
