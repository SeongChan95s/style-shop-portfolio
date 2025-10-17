'use client';

import { redirect, useRouter } from 'next/navigation';
import { Input } from '@/app/components/common/Input';
import { useQuery } from '@tanstack/react-query';
import { useSystemAlertStore } from '@/app/store';
import { FetchResponse } from '@/app/types';
import { getUserBySession } from '@/app/services/user/getUserBySession';
import { Form, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateUserFormData, updateUserSchema } from '@/app/lib/zod/schemas/user';
import { z } from 'zod';
import { Button } from '@/app/components/common/Button';
import { Spinner } from '@/app/components/common/Spinner';
import styles from './../user.module.scss';
import { useEffect } from 'react';
import { SubmitBar } from '@/app/components/global/AppBar';

export default function UserPersonalPage() {
	const router = useRouter();
	const {
		data: getUserResult,
		isPending,
		isError,
		isSuccess
	} = useQuery({
		queryFn: getUserBySession,
		queryKey: ['user']
	});

	const pushAlert = useSystemAlertStore(state => state.push);

	const {
		register,
		reset,
		handleSubmit,
		control,
		formState: { errors, isSubmitting }
	} = useForm<UpdateUserFormData>({
		resolver: zodResolver(updateUserSchema),
		defaultValues: {
			name: '',
			tel: '0',
			password: '',
			passwordConfirm: ''
		}
	});

	useEffect(() => {
		if (getUserResult && getUserResult.success && getUserResult.data) {
			const formData: UpdateUserFormData = {
				name: getUserResult.data.name || '',
				tel: String(getUserResult.data.tel || ''),
				password: '',
				passwordConfirm: ''
			};
			reset(formData);
		}
	}, [getUserResult, reset]);

	const handleSuccess = async ({ response }: { response: Response }) => {
		const result = await response.json();
		console.log('result', result);
		if (result.message) pushAlert(result.message);
		if (result.success) router.back();
	};

	if (isSuccess && !getUserResult.success) redirect('/');
	if (isError) redirect('/');
	if (isPending) return <></>;

	const user = getUserResult.success ? getUserResult.data : null;

	if (!user) redirect('/');

	if (isSuccess)
		return (
			<div className={`${styles.personalInfoPage} sectionLayoutLg`}>
				<Form
					className={styles.form}
					method="put"
					action="/api/user/updateUser"
					control={control}
					onSuccess={handleSuccess}>
					<div className="inner">
						<ul>
							<li>
								<Input
									type="email"
									label="이메일"
									defaultValue={user.email as string}
									disabled
								/>
							</li>
							<li>
								<Input label="이름" error={errors.name?.message} {...register('name')} />
							</li>
							<li>
								<Input
									type="tel"
									label="휴대폰 번호"
									placeholder="01012345678"
									error={errors.tel?.message}
									{...register('tel')}
								/>
							</li>
							<li>
								<Input
									type="password"
									label="비밀번호"
									placeholder="변경하지 않으려면 비워두세요"
									error={errors.password?.message}
									{...register('password')}
								/>
							</li>
							<li>
								<Input
									type="password"
									label="비밀번호 확인"
									placeholder="변경하지 않으려면 비워두세요"
									error={errors.passwordConfirm?.message}
									{...register('passwordConfirm')}
								/>
							</li>
						</ul>
					</div>
					<SubmitBar label={isSubmitting ? <Spinner size="xs" /> : '저장'} />
				</Form>
			</div>
		);
}
