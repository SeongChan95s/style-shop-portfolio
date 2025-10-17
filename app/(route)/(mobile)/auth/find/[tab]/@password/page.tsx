'use client';

import { Input } from '@/app/components/common/Input';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '@/app/components/common/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	findPasswordSchema,
	verifyResetCodeSchema,
	resetPasswordSchema
} from '@/app/lib/zod/schemas/auth';
import styles from './../../../auth.module.scss';
import { useState } from 'react';
import { sendPasswordReset, verifyResetCode, resetPassword } from '@/app/services/auth';
import { useSystemAlertStore } from '@/app/store';
import { HTTPError } from '@/app/services/HTTPError';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/app/components/common/Spinner';

type FindPasswordForm = {
	email: string;
};

type VerifyCodeForm = {
	email: string;
	code: string;
};

type ResetPasswordForm = {
	email: string;
	password: string;
	passwordConfirm: string;
};

export default function AuthFindPasswordPage() {
	const [step, setStep] = useState<'email' | 'code' | 'password'>('email');
	const [currentEmail, setCurrentEmail] = useState<string>('');
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	// 1단계: 이메일 전송
	const emailForm = useForm<FindPasswordForm>({
		resolver: zodResolver(findPasswordSchema)
	});

	// 2단계: 인증번호 확인
	const codeForm = useForm<VerifyCodeForm>({
		resolver: zodResolver(verifyResetCodeSchema),
		defaultValues: { email: currentEmail }
	});

	// 3단계: 비밀번호 변경
	const passwordForm = useForm<ResetPasswordForm>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: { email: currentEmail }
	});

	const onEmailSubmit: SubmitHandler<FindPasswordForm> = async data => {
		setIsLoading(true);

		try {
			const result = await sendPasswordReset(data.email);

			if (result.success) {
				setCurrentEmail(data.email);
				codeForm.setValue('email', data.email);
				passwordForm.setValue('email', data.email);
				setStep('code');
				useSystemAlertStore.getState().push(result.message);
			} else {
				useSystemAlertStore.getState().push(result.message);
			}
		} catch (error) {
			if (error instanceof HTTPError) useSystemAlertStore.getState().push(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const onCodeSubmit: SubmitHandler<VerifyCodeForm> = async data => {
		setIsLoading(true);

		try {
			const result = await verifyResetCode(data.email, data.code);

			if (result.success) {
				setStep('password');
				useSystemAlertStore.getState().push(result.message);
			} else {
				useSystemAlertStore.getState().push(result.message);
			}
		} catch (error) {
			if (error instanceof HTTPError) useSystemAlertStore.getState().push(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const onPasswordSubmit: SubmitHandler<ResetPasswordForm> = async data => {
		setIsLoading(true);

		try {
			const result = await resetPassword(data.email, data.password, data.passwordConfirm);

			if (result.success) {
				useSystemAlertStore.getState().push(result.message);
				router.push('/auth/login');
			} else {
				useSystemAlertStore.getState().push(result.message);
			}
		} catch (error) {
			if (error instanceof HTTPError) useSystemAlertStore.getState().push(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<section className={styles.authFindPasswordPage}>
			<div className="inner">
				{step === 'email' && (
					<form onSubmit={emailForm.handleSubmit(onEmailSubmit)}>
						<h3 className="hidden">비밀번호 찾기</h3>
						<Input
							id="email"
							label="이메일"
							error={emailForm.formState.errors?.email?.message}
							{...emailForm.register('email')}
						/>
						<Button
							className={styles.submitButton}
							type="submit"
							fill
							disabled={isLoading}>
							{isLoading ? '전송 중...' : '비밀번호 찾기'}
						</Button>
					</form>
				)}

				{step === 'code' && (
					<form onSubmit={codeForm.handleSubmit(onCodeSubmit)}>
						<h3 className="hidden">인증번호 확인</h3>
						<Input
							id="code"
							label="인증번호 (6자리)"
							placeholder="이메일로 받은 6자리 숫자를 입력하세요"
							error={codeForm.formState.errors?.code?.message}
							{...codeForm.register('code')}
						/>
						<Button
							className={styles.submitButton}
							type="submit"
							fill
							disabled={isLoading}>
							{isLoading ? '확인 중...' : '인증번호 확인'}
						</Button>
					</form>
				)}

				{step === 'password' && (
					<form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
						<h3 className="hidden">새 비밀번호 설정</h3>
						<Input
							id="password"
							label="새 비밀번호"
							type="password"
							error={passwordForm.formState.errors?.password?.message}
							{...passwordForm.register('password')}
						/>
						<Input
							id="passwordConfirm"
							label="새 비밀번호 확인"
							type="password"
							error={passwordForm.formState.errors?.passwordConfirm?.message}
							{...passwordForm.register('passwordConfirm')}
						/>
						<Button
							className={styles.submitButton}
							type="submit"
							fill
							disabled={isLoading}>
							{isLoading ? <Spinner size="xs" /> : '비밀번호 변경'}
						</Button>
					</form>
				)}
			</div>
		</section>
	);
}
