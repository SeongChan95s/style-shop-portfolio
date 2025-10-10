'use client';

import Link from 'next/link';
import { SocialLoginButton } from '@/app/components/auth';
import { Button } from '@/app/components/common/Button';
import {
	IconGithub,
	IconGoogle,
	IconKakao,
	IconNaver
} from '@/app/components/common/Icon';
import { signInWithCredentials } from '@/app/actions/auth/authActions';
import { getProviders } from 'next-auth/react';
import { useActionState, useCallback, useEffect, useState } from 'react';
import { useSystemAlertStore } from '@/app/store';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Input } from '@/app/components/common/Input';
import { ClientSafeProvider } from '@/app/types/next-auth';
import { getCallbackUrl } from '@/app/services/auth';
import styles from './../auth.module.scss';

const useCallbackUrl = (): [string, boolean] => {
	const [callbackUrl, setCallbackUrl] = useState('/');
	const [isSuccess, setIsSuccess] = useState(false);

	useEffect(() => {
		const fetchCallbackUrl = async () => {
			const result = await getCallbackUrl();
			if (result.success) {
				setCallbackUrl(result.data);
				setIsSuccess(true);
			}
		};
		fetchCallbackUrl();
	}, []);

	return [callbackUrl, isSuccess];
};

export default function LoginForm() {
	const [providers, setProviders] = useState<ClientSafeProvider[]>();
	const alertPush = useSystemAlertStore(state => state.push);
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const error = searchParams.get('error');
	const errorEmail = searchParams.get('email');
	const [callbackUrl, callbackIsSuccess] = useCallbackUrl();

	useEffect(() => {
		fetchProviders();

		if (error === 'email-exists' && errorEmail && callbackIsSuccess) {
			alertPush(`${errorEmail}은 이미 가입된 이메일입니다.`);

			const params = new URLSearchParams(searchParams);
			params.set('callbackUrl', callbackUrl);
			router.replace(`${pathname}?${params.toString()}`);
		}
	}, [error, errorEmail, callbackIsSuccess]);

	const fetchProviders = async () => {
		const providerList = await getProviders();
		if (providerList) setProviders(Object.values(providerList));
	};

	const [state, action] = useActionState(signInWithCredentials, {
		message: ''
	});

	useEffect(() => {
		if (state.message != '') alertPush(state.message);
	}, [state]);

	return (
		<section className={styles.loginForm}>
			<div className="inner">
				<form action={action}>
					<ul className={styles.inputWrap}>
						<li>
							<Input
								className={styles.input}
								name="email"
								type="text"
								label="이메일"
								variant="dynamic"
							/>
						</li>
						<li>
							<Input
								className={styles.input}
								name="password"
								type="password"
								label="패스워드"
								variant="dynamic"
							/>
						</li>
					</ul>
					<div className={styles.buttonWrap}>
						<Button type="submit" size="lg">
							로그인
						</Button>
						<Link className="button" href="/auth/register">
							<Button size="lg">회원가입</Button>
						</Link>
					</div>
					<div className={styles.textButtonWrap}>
						<Link href="/auth/find/id">아이디 찾기</Link>
						<span>|</span>
						<Link href="/auth/find/password">비밀번호 찾기</Link>
					</div>
					<div className={styles.socialLogin}>
						{providers &&
							providers
								.filter(provider => provider.id != 'credentials')
								.map(provider => {
									let icon;
									switch (provider.id) {
										case 'google':
											icon = <IconGoogle />;
											break;
										case 'kakao':
											icon = <IconKakao />;
											break;
										case 'naver':
											icon = <IconNaver />;
											break;
										case 'github':
											icon = <IconGithub />;
											break;
									}

									return (
										<SocialLoginButton
											className={styles.socialLoginButton}
											key={provider.name}
											provider={provider}
											icon={icon}
										/>
									);
								})}
					</div>
				</form>
			</div>
		</section>
	);
}
