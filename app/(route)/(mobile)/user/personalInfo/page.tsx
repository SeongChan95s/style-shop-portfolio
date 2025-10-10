'use client';

import { redirect } from 'next/navigation';
import SubmitForm from '../SubmitForm';
import { Form } from '@/app/components/common/Form';
import { Input } from '@/app/components/common/Input';
import { useCreateFormStore } from '@/app/components/common/Form/useForm';
import { useStore } from 'zustand';
import { useQuery } from '@tanstack/react-query';
import { regName, regPassword } from '@/app/constants';
import { useSubmitAction } from '@/app/hooks/async';
import { updateUserAction } from '@/app/actions/user/updateUserAction';
import { useSystemAlertStore } from '@/app/store';
import { useViewTransition } from '@/app/hooks';
import { FetchResponse } from '@/app/types';
import { getUserBySession } from '@/app/services/user/getUserBySession';
import styles from './../user.module.scss';

export default function UserPersonalPage() {
	const {
		data: getUserResponse,
		isPending,
		isError,
		isSuccess
	} = useQuery({
		queryFn: getUserBySession,
		queryKey: ['user']
	});

	const store = useCreateFormStore();
	const formData = useStore(store, state => state.formData);
	const setFormData = useStore(store, state => state.setFormData);

	const handleChangeFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ [e.target.name]: e.target.value });
	};

	const pushAlert = useSystemAlertStore(state => state.push);
	const { handleViewTransition } = useViewTransition();

	const handleSubmitSuccess = (data: FetchResponse) => {
		if (data.message) pushAlert(data.message);
		if (data.success) handleViewTransition('back', 'prev');
	};

	const { handleSubmit } = useSubmitAction({
		action: updateUserAction,
		initialData: {},
		onSuccess: handleSubmitSuccess
	});

	if (isSuccess && !getUserResponse.success) redirect('/');
	if (isError) redirect('/');
	if (isPending) return <></>;

	const user = getUserResponse.success ? getUserResponse.data : null;

	if (!user) redirect('/');

	if (isSuccess)
		return (
			<div className={`${styles.personalInfoPage} sectionLayoutLg`}>
				<Form className={styles.form} store={store} onSubmit={handleSubmit}>
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
								<Input
									name="name"
									label="이름"
									defaultValue={user.name as string}
									onChange={handleChangeFormData}
								/>
								<Form.Validation
									name="name"
									label="2글자 이상"
									defaultValue={user.name as string}
									onValidate={value => regName.test(value)}
								/>
							</li>
							<li>
								<Input
									type="password"
									name="password"
									label="비밀번호"
									onChange={handleChangeFormData}
								/>
								<Form.Validation
									name="password"
									label="영문&숫자 조합 8자리 이상"
									onValidate={value => regPassword.test(value)}
								/>
							</li>
							<li>
								<Input
									type="password"
									name="passwordConfirm"
									label="비밀번호 확인"
									onChange={handleChangeFormData}
								/>
								<Form.Validation
									onValidate={value =>
										typeof formData.password != 'undefined' && formData.password == value
									}
									name="passwordConfirm"
									label="비밀번호 일치"
								/>
							</li>
						</ul>
						<SubmitForm />
					</div>
				</Form>
			</div>
		);
}
