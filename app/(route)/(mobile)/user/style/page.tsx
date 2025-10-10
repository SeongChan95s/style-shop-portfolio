'use client';

import { Input } from '@/app/components/common/Input';
import { RadioButton } from '@/app/components/common/RadioButton';
import { useSubmitAction } from '@/app/hooks/async';
import { updateUserAction } from '@/app/actions/user';
import { useSystemAlertStore } from '@/app/store';
import { FetchResponse } from '@/app/types';
import { useViewTransition } from '@/app/hooks';
import { useQuery } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import { getUserBySession } from '@/app/services/user/getUserBySession';
import { SubmitBar } from '@/app/components/global/AppBar';
import styles from './../user.module.scss';

export default function UserStylePage() {
	const {
		data: getUserResponse,
		isSuccess,
		isPending,
		isError
	} = useQuery({
		queryFn: getUserBySession,
		queryKey: ['user'],
		staleTime: 0,
		refetchOnMount: true
	});

	const { handleViewTransition } = useViewTransition();
	const handleSubmitSuccess = (data: FetchResponse) => {
		if (data.message) pushAlert(data.message);
		if (data.success) handleViewTransition('back', 'prev');
	};

	const pushAlert = useSystemAlertStore(state => state.push);
	const { handleSubmit } = useSubmitAction({
		action: updateUserAction,
		onSuccess: handleSubmitSuccess
	});

	if (isError) redirect('/');
	if (isPending) return <></>;

	const user = getUserResponse.success ? getUserResponse.data : null;

	if (!user) redirect('/');

	if (isError) redirect('/');
	if (isSuccess)
		return (
			<div className={styles.userStylePage}>
				<div className={`${styles.personalInfoPage} sectionLayoutLg`}>
					<form className={styles.form} onSubmit={handleSubmit}>
						<div className="inner">
							<article>
								<h4 className="headerLayoutSm">성별</h4>
								<div className={styles.genderWrap}>
									<RadioButton
										name="gender"
										value="남성"
										shape="rounded"
										variant="filled"
										defaultChecked={user.gender === '남성'}>
										남성
									</RadioButton>
									<RadioButton
										name="gender"
										value="여성"
										shape="rounded"
										variant="filled"
										defaultChecked={user.gender === '여성'}>
										여성
									</RadioButton>
								</div>
							</article>
							<article>
								<h4 className="headerLayoutSm">체형</h4>
								<ul>
									<li>
										<Input
											type="number"
											variant="dynamic"
											name="height"
											label="키"
											maxLength={3}
											defaultValue={user?.height?.toString()}
										/>
									</li>
									<li>
										<Input
											type="number"
											variant="dynamic"
											name="weight"
											label="몸무게"
											maxLength={3}
											defaultValue={user?.weight?.toString()}
										/>
									</li>
								</ul>
							</article>
						</div>
						<SubmitBar label={<>{'수정하기'}</>} />
					</form>
				</div>
			</div>
		);
}
