'use client';

import { Input } from '@/app/components/common/Input';
import { Textarea } from '@/app/components/common/Textarea';
import { Button } from '@/app/components/common/Button';
import { useActionState, useEffect, useRef } from 'react';
import { useSystemAlertStore } from '@/app/store';
import { useQueryClient } from '@tanstack/react-query';
import { updateReviewAction } from '@/app/actions/review/updateReviewAction';
import ImagePicker from '@/app/components/common/ImagePicker';
import { deleteReview } from '@/app/services/review/deleteReview';
import { useRouter } from 'next/navigation';
import { Review } from '@/app/types';
import styles from './../../../admin.module.scss';
import { convertImagePickerItems } from '@/app/components/common/ImagePicker/ImagePicker.utils';

interface ReviewFormProps {
	initialReview: Review<string>;
	isNew?: boolean;
}

export default function ReviewForm({ initialReview, isNew = false }: ReviewFormProps) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const isFirstRender = useRef(true);

	const [state, action, _isPending] = useActionState(updateReviewAction, {
		success: false,
		message: ''
	});

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		useSystemAlertStore.getState().push(state.message);
		if (state.success) {
			queryClient.invalidateQueries({ queryKey: ['review'] });
			router.push('/admin/review');
		}
	}, [state, queryClient, router]);

	const handleDeleteReview = async () => {
		if (!initialReview?._id || isNew) return;
		const result = await deleteReview(initialReview._id);
		if (result.success) {
			useSystemAlertStore.getState().push(result.message);
			router.push('/admin/review');
		}
	};

	return (
		<div className={styles.productEditPage}>
			<div className="inner">
				<header>
					<h3>{isNew ? '새 리뷰 추가' : '리뷰 수정'}</h3>
				</header>

				<form action={action}>
					<ul className={styles.groupWrap}>
						<li className={styles.id}>
							<Input
								defaultValue={initialReview?._id}
								name="_id"
								label="id"
								variant="outlined"
								fill
								readOnly
							/>
						</li>

						{isNew ? (
							<>
								<li className={styles.name}>
									<Input
										name="userEmail"
										label="작성자 이메일"
										variant="outlined"
										fill
										required
									/>
								</li>
								<li className={styles.name}>
									<Input
										name="productItemId"
										label="상품 아이템 ID"
										variant="outlined"
										fill
										required
									/>
								</li>
								<li className={styles.name}>
									<Input
										name="orderId"
										label="주문 ID"
										variant="outlined"
										fill
										required
									/>
								</li>
							</>
						) : (
							<>
								<li className={styles.name}>
									<Input
										defaultValue={initialReview?.author.email}
										label="작성자 이메일"
										variant="outlined"
										fill
										readOnly
									/>
									<input
										type="hidden"
										name="productItemId"
										value={initialReview?.productItemId}
									/>
									<input type="hidden" name="orderId" value={initialReview?.orderId} />
								</li>
								<li className={styles.name}>
									<Input
										defaultValue={initialReview?.productItemId}
										label="상품 아이템 ID"
										variant="outlined"
										fill
										readOnly
									/>
								</li>
								<li className={styles.name}>
									<Input
										defaultValue={initialReview?.orderId}
										label="주문 ID"
										variant="outlined"
										fill
										readOnly
									/>
								</li>
								<li className={styles.name}>
									<Input
										defaultValue={
											initialReview?.timestamp
												? new Date(initialReview.timestamp).toLocaleString('ko-KR')
												: ''
										}
										label="작성일"
										variant="outlined"
										fill
										readOnly
									/>
								</li>
							</>
						)}

						<li className={styles.price}>
							<Input
								type="number"
								defaultValue={initialReview?.score?.toString() ?? '5'}
								name="score"
								label="별점 (1-5)"
								variant="outlined"
								fill
								required
							/>
						</li>

						<li className={styles.category}>
							<h5>리뷰 내용</h5>
							<Textarea
								defaultValue={initialReview?.content?.text ?? ''}
								name="content.text"
								label="리뷰 내용"
								count
								fill
								maxLength={1000}
							/>
						</li>

						<li className={styles.keywords}>
							<h5>이미지</h5>
							<ImagePicker
								name="images"
								defaultValue={convertImagePickerItems(
									initialReview?.content?.images ?? []
								)}
							/>
						</li>
					</ul>

					<div className={styles.bottom}>
						<div className={styles.bottomFrame}>
							<div className={styles.left}>
								{!isNew && (
									<Button type="button" onClick={handleDeleteReview}>
										리뷰 삭제
									</Button>
								)}
							</div>

							<div className={styles.right}>
								<Button type="button" onClick={() => router.push('/admin/review')}>
									목록으로
								</Button>
								<Button type="submit">저장</Button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
