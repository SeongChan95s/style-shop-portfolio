'use client';

import { Input } from '@/app/components/common/Input';
import styles from './../../../auth.module.scss';
import { Form, useForm } from 'react-hook-form';
import { SubmitBar } from '@/app/components/global/AppBar';
import { Spinner } from '@/app/components/common/Spinner';
import { useSystemAlertStore } from '@/app/store';
import { findMyIdSchema } from '@/app/lib/zod/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/app/components/common/Button';
import { useRouter } from 'next/navigation';

export default function AuthFindIdPage() {
	const {
		register,
		control,
		formState: { isSubmitting, errors }
	} = useForm({
		resolver: zodResolver(findMyIdSchema),
		defaultValues: {
			name: '',
			tel: ''
		}
	});

	const [id, setId] = useState();

	const handleSuccess = async ({ response }: { response: Response }) => {
		const result = await response.json();
		if (!result.success) {
			useSystemAlertStore.getState().push(result.message);
		} else {
			setId(result.data);
		}
	};

	const router = useRouter();

	return (
		<section className={styles.authFindIdPage}>
			<Form
				action="/api/auth/findMyId"
				method="post"
				control={control}
				onSuccess={handleSuccess}>
				<div className="inner">
					<ul>
						<li>
							<Input label="이름" {...register('name')} />
						</li>
						<li>
							<Input
								label="전화번호"
								type="tel"
								{...register('tel')}
								error={errors.tel ? errors.tel.message : undefined}
							/>
						</li>
					</ul>

					{id && (
						<div className={styles.resultWrap}>
							<div className={styles.resultId}>
								내 아이디는 <span>{id}</span> 입니다.
							</div>
							<Button
								className={styles.loginButton}
								variant="outlined"
								fill
								onClick={() => router.push('/auth/login')}>
								로그인하기
							</Button>
						</div>
					)}
				</div>

				<SubmitBar label={isSubmitting ? <Spinner size="sm" /> : '저장'} />
			</Form>
		</section>
	);
}
