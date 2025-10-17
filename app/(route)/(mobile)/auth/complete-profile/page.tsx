'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/app/components/common/Button';
import { Input } from '@/app/components/common/Input';
import { useSystemAlertStore } from '@/app/store';
import { z } from 'zod';
import { completeProfile } from '@/app/services/auth';
import { completeProfileSchema } from '@/app/lib/zod/schemas/auth';
import { Spinner } from '@/app/components/common/Spinner';
import styles from './../auth.module.scss';

export default function CompleteProfilePage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const alertPush = useSystemAlertStore(state => state.push);

	const provider = searchParams.get('provider');
	const providerId = searchParams.get('id');
	const existingEmail = searchParams.get('email');
	const existingName = searchParams.get('name');
	const missingFields = searchParams.getAll('missing');

	type CompleteProfileFormData = z.infer<typeof completeProfileSchema>;

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = useForm<CompleteProfileFormData>({
		resolver: zodResolver(completeProfileSchema),
		defaultValues: {
			email: existingEmail || '',
			name: existingName || ''
		}
	});

	useEffect(() => {
		if (!provider || !providerId) {
			router.push('/auth/login');
		}
	}, [provider, providerId, router]);

	const onSubmit = async (data: CompleteProfileFormData) => {
		try {
			const result = await completeProfile({
				name: data.name,
				email: data.email,
				provider: provider!,
				providerId: providerId!
			});

			alertPush(result.message);
			if (result.success) router.push('/');
		} catch (error) {
			if (error instanceof Error) {
				alertPush(error.message);
			}
		}
	};

	if (!provider || !providerId) {
		return null;
	}

	const getProviderName = (provider: string) => {
		switch (provider) {
			case 'kakao':
				return '카카오';
			case 'google':
				return '구글';
			case 'naver':
				return '네이버';
			case 'github':
				return '깃허브';
			default:
				return provider;
		}
	};

	const providerName = getProviderName(provider);

	return (
		<div className={styles.completeProfile}>
			<div className={styles.content}>
				<h1 className={styles.title}>추가 정보 입력</h1>
				<p className={styles.description}>
					{providerName} 로그인이 완료되었습니다.
					<br />
					서비스 이용을 위해 추가 정보를 입력해주세요.
				</p>

				<form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
					<div className={styles.inputWrapper}>
						<Input
							type="email"
							label="이메일"
							placeholder="example@email.com"
							variant="dynamic"
							className={styles.input}
							readOnly={!missingFields.includes('email')}
							error={errors.email ? errors.email.message : undefined}
							{...register('email')}
						/>
					</div>

					<div className={styles.inputWrapper}>
						<Input
							type="text"
							label="닉네임"
							placeholder="닉네임을 입력하세요"
							variant="dynamic"
							className={styles.input}
							error={errors.name ? errors.name.message : undefined}
							{...register('name')}
						/>
					</div>

					<div className={styles.buttonGroup}>
						<Button type="submit" size="lg" disabled={isSubmitting} fill>
							{isSubmitting ? <Spinner size="xs" /> : '저장'}
						</Button>

						<Button
							type="button"
							variant="outlined"
							size="lg"
							onClick={() => router.push('/auth/login')}
							disabled={isSubmitting}
							fill>
							취소
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
