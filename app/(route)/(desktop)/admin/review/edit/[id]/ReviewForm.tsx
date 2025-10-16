'use client';

import { Input } from '@/app/components/common/Input';
import { Textarea } from '@/app/components/common/Textarea';
import { Button } from '@/app/components/common/Button';
import { useSystemAlertStore } from '@/app/store';
import { useQueryClient } from '@tanstack/react-query';
import ImagePicker, {
	ImagePickerItem
} from '@/app/components/common/ImagePicker/ImagePicker';
import { deleteReview } from '@/app/services/review/deleteReview';
import { useRouter } from 'next/navigation';
import { Review } from '@/app/types';
import styles from './../../../admin.module.scss';
import { convertImagePickerItems } from '@/app/components/common/ImagePicker/ImagePicker.utils';
import { useForm, Controller } from 'react-hook-form';
import { updateReview } from '@/app/services/review/updateReview';
import ObjectId from 'bson-objectid';

export type ReviewFormData = {
	_id: string;
	userEmail?: string;
	productItemId: string;
	orderId: string;
	score: number;
	content: {
		text: string;
		images: ImagePickerItem[];
	};
	files: File[];
};

interface ReviewFormProps {
	initialReview?: Review<string>;
	isNew?: boolean;
}

export default function ReviewForm({ initialReview, isNew = false }: ReviewFormProps) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const alertPush = useSystemAlertStore(state => state.push);

	const {
		register,
		handleSubmit,
		control,
		formState: { errors: _errors },
		setValue
	} = useForm<ReviewFormData>({
		defaultValues: {
			_id: initialReview?._id ?? new ObjectId().toString(),
			userEmail: isNew ? '' : initialReview?.author.email,
			productItemId: initialReview?.productItemId ?? '',
			orderId: initialReview?.orderId ?? '',
			score: initialReview?.score ?? 5,
			content: {
				text: initialReview?.content?.text ?? '',
				images: convertImagePickerItems(initialReview?.content?.images ?? [])
			},
			files: []
		}
	});

	const onSubmit = async (data: ReviewFormData) => {
		await updateReview(data, isNew);
		queryClient.invalidateQueries({
			queryKey: ['review']
		});
		router.push('/admin/review');
	};

	const handleDeleteReview = async () => {
		if (!initialReview?._id || isNew) return;
		const result = await deleteReview(initialReview._id);
		if (result.success) {
			alertPush(result.message);
			router.push('/admin/review');
		}
	};

	return (
		<section className={`${styles.editForm} ${styles.reviewForm}`}>
			<div className="inner">
				<header>
					<h3>{isNew ? '새 리뷰 추가' : '리뷰 수정'}</h3>
				</header>

				<form onSubmit={handleSubmit(onSubmit)}>
					<ul className={styles.groupWrap}>
						<li className={styles.id}>
							<Input {...register('_id')} label="id" variant="outlined" fill readOnly />
						</li>

						<li className={styles.productId}>
							<Input
								{...register('productItemId')}
								label="상품 아이템 ID"
								variant="outlined"
								fill
								readOnly={!isNew}
								required={isNew}
							/>
						</li>
						<li className={styles.orderId}>
							<Input
								{...register('orderId')}
								label="주문 ID"
								variant="outlined"
								fill
								readOnly={!isNew}
								required={isNew}
							/>
						</li>

						<li className={styles.email}>
							<Input
								{...register('userEmail')}
								label="작성자 이메일"
								variant="outlined"
								fill
								readOnly={!isNew}
								required={isNew}
							/>
						</li>
						{!isNew && (
							<li className={styles.date}>
								<Input
									value={
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
						)}

						<li className={styles.score}>
							<Input
								{...register('score', { valueAsNumber: true })}
								type="number"
								label="별점 (1-5)"
								variant="outlined"
								fill
								required
							/>
						</li>

						<li className={styles.text}>
							<Controller
								control={control}
								name="content.text"
								render={({ field }) => (
									<Textarea
										variant="outlined"
										label="리뷰 내용"
										count
										fill
										rows={5}
										{...field}
									/>
								)}
							/>
						</li>

						<li className={styles.image}>
							<h5>이미지</h5>
							<Controller
								name="content.images"
								control={control}
								render={({ field }) => (
									<ImagePicker
										{...field}
										onFilesChange={files => setValue('files', files)}
									/>
								)}
							/>
						</li>
					</ul>

					<div className={styles.formButtonWrap}>
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
				</form>
			</div>
		</section>
	);
}
