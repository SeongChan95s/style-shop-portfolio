'use client';

import { useRouter } from 'next/navigation';
import { Textarea } from '@/app/components/common/Textarea';
import { useActionState, useEffect, useRef, useState } from 'react';
import { useSystemAlertStore } from '@/app/store';
import { Review } from '@/app/types';
import { Checkbox } from '@/app/components/common/Checkbox';
import ScoreRating from '@/app/components/review/ScoreRating';
import { Divider } from '@/app/components/common/Divider';
import { Form } from '@/app/components/common/Form';
import { useCreateFormStore, useFormStore } from '@/app/components/common/Form/useForm';
import { SubmitBar } from '@/app/components/global/AppBar';
import { useStore } from 'zustand';
import { useQueryClient } from '@tanstack/react-query';
import ImagePicker from '@/app/components/common/ImagePicker';
import { convertImagePickerItems } from '@/app/components/common/ImagePicker/ImagePicker.utils';
import { updateReviewAction } from '@/app/actions/review/updateReviewAction';
import styles from './reviewEdit.module.scss';

interface CheckboxGroupProps {
	onAllCheck: (state: boolean) => void;
}

function CheckboxGroup({ onAllCheck }: CheckboxGroupProps) {
	const [check, setCheck] = useState<boolean[]>([false, false]);
	const allCheck = check.every(Boolean);

	useEffect(() => {
		onAllCheck(allCheck);
	}, [allCheck]);

	const handleAllCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCheck([e.target.checked, e.target.checked]);
	};

	const handleCheck = (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
		const copyCheck = [...check];
		copyCheck[idx] = e.target.checked;
		setCheck(copyCheck);
	};

	return (
		<div className={`${styles.checkboxGroup}`}>
			<Checkbox checked={allCheck} onChange={handleAllCheck}>
				전체 동의하기
			</Checkbox>
			<Checkbox checked={check[0]} onChange={handleCheck(0)}>
				작성된 후기는 STYLE 홍보 컨텐츠로 사용될 수 있습니다.
			</Checkbox>
			<Checkbox checked={check[1]} onChange={handleCheck(1)}>
				보다 나은 후기 서비스 제공을 위해 성별/키/몸무게 정보수집 이용에 동의합니다.
				(필수)
			</Checkbox>
		</div>
	);
}

function SubmitForm() {
	const validateState = useFormStore(state => state.validateResult);

	return (
		<SubmitBar label="작성하기" disabled={Object.values(validateState).includes(false)} />
	);
}

export default function PostForm({
	review,
	productItemId,
	orderId,
	reviewId,
	callbackUrl
}: {
	review: Review<string> | null;
	productItemId: string;
	orderId: string;
	reviewId?: string;
	callbackUrl?: string;
}) {
	const countRef = useRef(0);
	const router = useRouter();
	const store = useCreateFormStore();
	const setValidateState = useStore(store, state => state.setValidateResult);
	const queryClient = useQueryClient();

	const [state, action] = useActionState(updateReviewAction, {
		success: false,
		message: ''
	});

	useEffect(() => {
		if (countRef.current > 0) {
			useSystemAlertStore.getState().push(state.message);
		}
		if (state.success) {
			queryClient.invalidateQueries({ queryKey: ['review'] });
			if (callbackUrl) {
				router.push(callbackUrl);
			} else {
				router.back();
			}
		}
		countRef.current += 1;
	}, [state, callbackUrl, router, queryClient]);

	return (
		<section className={`${styles.postForm} sectionLayoutMd`}>
			<Form id="editReview" action={action} store={store}>
				<div className="inner">
					<input type="hidden" name="_id" value={reviewId ?? undefined} />
					<input type="hidden" name="productItemId" value={productItemId} />
					<input type="hidden" name="orderId" value={orderId} />

					<ScoreRating
						className={styles.scoreRating}
						name="score"
						size="lg"
						defaultValue={review?.score ?? 0}
						onChange={value => {
							setValidateState({ score: value != 0 });
						}}
					/>

					<Divider />

					<header className="headerLayoutMd">
						<h3>어떤 점이 좋았나요?</h3>
					</header>

					<Textarea
						className={`${styles.textarea}`}
						name="content.text"
						label="내용"
						placeholder="다른 회원들이 도움 받을 수 있도록 상품에 대한 의견을 자세히 공유해주세요."
						rows={8}
						defaultValue={review?.content?.text}
						count
						maxLength={200}
						validateFn={[
							{
								fn: value => value.length > 20,
								message: '20자 이상'
							}
						]}
						onValidate={value => setValidateState({ 'text-content': value })}
					/>

					<header className="headerLayoutMd">
						<h4>사진 첨부</h4>
					</header>

					<ImagePicker
						name="images"
						defaultValue={convertImagePickerItems(review?.content?.images) ?? []}
					/>

					<Divider />
					<CheckboxGroup
						onAllCheck={value => {
							setValidateState({ 'terms-varified': value });
						}}
					/>
				</div>

				<SubmitForm />
			</Form>
		</section>
	);
}
