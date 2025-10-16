'use client';

import { Input } from '@/app/components/common/Input';
import { Textarea } from '@/app/components/common/Textarea';
import { Button } from '@/app/components/common/Button';
import { useSystemAlertStore } from '@/app/store';
import { useQueryClient } from '@tanstack/react-query';
import ImagePicker, {
	ImagePickerItem
} from '@/app/components/common/ImagePicker/ImagePicker';
import { deleteContent } from '@/app/services/contents/deleteContent';
import { useRouter } from 'next/navigation';
import { Magazine } from '@/app/types';
import styles from './../../../../admin.module.scss';
import { convertImagePickerItems } from '@/app/components/common/ImagePicker/ImagePicker.utils';
import { useForm, Controller } from 'react-hook-form';
import { updateMagazine } from '@/app/services/contents/updateMagazine';
import ObjectId from 'bson-objectid';
import { StackField } from '@/app/components/common/StackField';

export type MagazineFormData = {
	_id: string;
	name: string;
	title: string;
	body: string;
	url?: string;
	productGroupsId: string[];
	keywords: string[];
	images: ImagePickerItem[];
	files: File[];
};

interface MagazineFormProps {
	initialMagazine?: Magazine;
	isNew?: boolean;
}

export default function MagazineForm({
	initialMagazine,
	isNew = false
}: MagazineFormProps) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const alertPush = useSystemAlertStore(state => state.push);

	const {
		register,
		handleSubmit,
		control,
		formState: { errors: _errors },
		setValue
	} = useForm<MagazineFormData>({
		defaultValues: {
			_id: initialMagazine?._id.toString() ?? new ObjectId().toString(),
			name: initialMagazine?.name ?? '매거진',
			title: initialMagazine?.title ?? '',
			body: initialMagazine?.body ?? '',
			url: initialMagazine?.url ?? '',
			productGroupsId: initialMagazine?.productGroupsId ?? [],
			keywords: initialMagazine?.keywords ?? [],
			images: convertImagePickerItems(initialMagazine?.images ?? []),
			files: []
		}
	});

	const onSubmit = async (data: MagazineFormData) => {
		await updateMagazine(data, isNew);
		queryClient.invalidateQueries({
			queryKey: ['magazine']
		});
		router.push('/admin/content/magazine');
	};

	const handleDeleteMagazine = async () => {
		if (!initialMagazine?._id || isNew) return;
		const result = await deleteContent(initialMagazine._id.toString());
		if (result.success) {
			alertPush(result.message);
			router.push('/admin/content/magazine');
		}
	};

	return (
		<section className={`${styles.editForm} ${styles.magazineForm}`}>
			<div className="inner">
				<header>
					<h3>{isNew ? '새 매거진 추가' : '매거진 수정'}</h3>
				</header>

				<form onSubmit={handleSubmit(onSubmit)}>
					<ul className={styles.groupWrap}>
						<li className={styles.id}>
							<Input {...register('_id')} label="id" variant="outlined" fill readOnly />
						</li>

						<li className={styles.name}>
							<Input
								{...register('name')}
								label="이름"
								variant="outlined"
								fill
								readOnly
							/>
						</li>

						<li className={styles.title}>
							<Input
								{...register('title')}
								label="제목"
								variant="outlined"
								fill
								required
							/>
						</li>

						<li className={styles.url}>
							<Input {...register('url')} label="URL" variant="outlined" fill />
						</li>

						<li className={styles.body}>
							<Controller
								control={control}
								name="body"
								render={({ field }) => (
									<Textarea
										variant="outlined"
										label="본문"
										count
										fill
										rows={6}
										maxLength={5000}
										{...field}
									/>
								)}
							/>
						</li>

						<li className={styles.productGroupsId}>
							<Controller
								control={control}
								name="productGroupsId"
								render={({ field }) => (
									<StackField
										{...field}
										label="상품 그룹 ID"
										placeholder="상품 그룹 ID 입력"
										maxSize={2}
									/>
								)}
							/>
						</li>

						<li className={styles.keywords}>
							<Controller
								control={control}
								name="keywords"
								render={({ field }) => (
									<StackField {...field} label="키워드" placeholder="키워드 입력" />
								)}
							/>
						</li>

						<li className={styles.image}>
							<h5>이미지</h5>
							<Controller
								name="images"
								control={control}
								render={({ field }) => (
									<ImagePicker
										{...field}
										maxCount={1}
										onFilesChange={files => setValue('files', files)}
									/>
								)}
							/>
						</li>
					</ul>

					<div className={styles.formButtonWrap}>
						<div className={styles.left}>
							{!isNew && (
								<Button type="button" onClick={handleDeleteMagazine}>
									매거진 삭제
								</Button>
							)}
						</div>

						<div className={styles.right}>
							<Button
								type="button"
								onClick={() => router.push('/admin/content/magazine')}>
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
