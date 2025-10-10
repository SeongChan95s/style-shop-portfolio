'use client';

import { Form } from '@/app/components/common/Form';
import { useSystemAlertStore } from '@/app/store';
import { useEffect } from 'react';
import { regEmail, regName, regPassword } from '@/app/constants';
import { useCreateFormStore } from '@/app/components/common/Form/useForm';
import { useStore } from 'zustand';
import { redirect } from 'next/navigation';
import { signUpWithCredentials } from '@/app/actions/auth/authActions';
import { Input } from '@/app/components/common/Input';
import RegisterSubmitBar from './RegisterSubmitBar';
import { useSubmitAction } from '@/app/hooks/async';
import styles from './../auth.module.scss';

export default function RegisterForm() {
	const alertPush = useSystemAlertStore(state => state.push);
	const store = useCreateFormStore();
	const setFormData = useStore(store, state => state.setFormData);

	const { result, handleSubmit } = useSubmitAction({
		action: signUpWithCredentials
	});

	useEffect(() => {
		if (result) {
			if (result.message != '' && result.message) alertPush(result.message);
			if (result.message == '회원가입에 성공했습니다.') redirect('/');
		}
	}, [result]);

	return (
		<div className={styles.registerForm}>
			<div className="inner">
				<Form id="registerForm" store={store} onSubmit={handleSubmit}>
					<ul className={styles.inputWrap}>
						<li>
							<Input
								name="userEmail"
								type="text"
								label="이메일"
								variant="dynamic"
								onChange={e => {
									setFormData({ userEmail: e.target.value });
								}}
							/>
							<Form.Validation
								name="userEmail"
								label="abcd@email.com"
								onValidate={value => regEmail.test(value)}
							/>
						</li>
						<li>
							<Input
								name="userPassword"
								type="password"
								label="비밀번호"
								variant="dynamic"
								onChange={e => setFormData({ userPassword: e.target.value })}
							/>
							<Form.Validation
								onValidate={value => regPassword.test(value)}
								name="userPassword"
								label="영문&숫자 조합 8자리 이상"
							/>
						</li>
						<li>
							<Input
								name="userName"
								type="text"
								label="닉네임"
								variant="dynamic"
								onChange={e => setFormData({ userName: e.target.value })}
							/>
							<Form.Validation
								name="userName"
								label="2글자 이상"
								onValidate={value => regName.test(value)}
							/>
						</li>
					</ul>
					<RegisterSubmitBar />
				</Form>
			</div>
		</div>
	);
}
