'use client';

import { Input } from '@/app/components/common/Input';
import { Button } from '@/app/components/common/Button';
import PostCodeSheet, {
	usePostCodeSheetStore
} from '@/app/components/user/PostCodeSheet';
import { Checkbox } from '@/app/components/common/Checkbox';
import { SubmitBar } from '@/app/components/global/AppBar';
import { useForm, Form } from 'react-hook-form';
import { useEffect } from 'react';
import { Address } from '@/app/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { addressSchema } from '@/app/lib/zod/schemas/user';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAddressById } from '@/app/services/user/getAddressById';
import { use } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { useSystemAlertStore } from '@/app/store';
import styles from './../../../user.module.scss';

export default function UserAddressCreatePage({
	params
}: {
	params: Promise<{ id?: string[] }>;
}) {
	const { id } = use(params);
	if (id && id.length >= 2) notFound();
	const isExistedId = !!id && id.length > 0;

	const router = useRouter();

	const queryClient = useQueryClient();
	const { data, isError } = useQuery({
		queryFn: () => getAddressById(id?.[0] || ''),
		queryKey: ['user', 'address', id?.[0] || ''],
		enabled: isExistedId && !!id?.[0]
	});

	const {
		register,
		setValue,
		control,
		reset,
		formState: { errors }
	} = useForm<Address<string> & { default: boolean }>({
		defaultValues: {
			_id: '',
			name: '',
			tel: '',
			post: {
				code: '',
				road: '',
				detail: ''
			},
			default: false
		},
		resolver: zodResolver(addressSchema)
	});

	useEffect(() => {
		if (data && data.success && data.data) {
			reset(data.data);
		}
	}, [data]);

	const handleAddPost = () => {
		usePostCodeSheetStore.getState().setState('expanded');
	};

	const handleActionSuccess = async ({ response }: { response: Response }) => {
		const result = await response.json();
		if (result.success) {
			queryClient.invalidateQueries({ queryKey: ['user', 'address'] });
			useSystemAlertStore.getState().push(result.message);
			router.back();
		}
	};

	if (isError) notFound();

	return (
		<div className={styles.userAddressCreatePage}>
			<section className="sectionLayoutLg">
				<div className="inner">
					<Form
						id="createAddress"
						action="/api/user/updateAddressById"
						method="post"
						control={control}
						onSuccess={handleActionSuccess}>
						<ul className={styles.depth1}>
							<input type="hidden" {...register('_id')} />
							<li>
								<Input
									label="이름"
									size="sm"
									{...register('name')}
									error={errors?.name?.message}
								/>
							</li>
							<li>
								<Input
									type="number"
									label="휴대폰번호"
									size="sm"
									{...register('tel')}
									error={errors?.tel?.message}
								/>
							</li>
							<li>
								<ul className={styles.depth2}>
									<li>
										<Input
											{...register('post.code')}
											label="주소"
											type="number"
											placeholder="우편번호"
											size="sm"
											button={
												<Button variant="outlined" size="sm" onClick={handleAddPost}>
													주소 찾기
												</Button>
											}
										/>
									</li>
									<li>
										<Input {...register('post.road')} size="sm" placeholder="주소" />
									</li>
									<li>
										<Input
											{...register('post.detail')}
											size="sm"
											placeholder="상세주소"
											error={errors?.post?.code?.message ?? errors?.post?.road?.message}
										/>
									</li>
								</ul>
							</li>
							<li>
								<Checkbox {...register('default')}>기본 배송지로 설정</Checkbox>
							</li>
						</ul>
					</Form>
				</div>
			</section>
			<PostCodeSheet
				onComplete={data => {
					setValue('post.code', data.zonecode);
					setValue('post.road', data.roadAddress);
				}}
			/>
			<SubmitBar form="createAddress" label="저장하기" />
		</div>
	);
}
