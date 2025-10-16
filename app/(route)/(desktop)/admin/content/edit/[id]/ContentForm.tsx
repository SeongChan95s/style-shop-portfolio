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
import { Content } from '@/app/types';
import styles from './../../../admin.module.scss';
import { convertImagePickerItems } from '@/app/components/common/ImagePicker/ImagePicker.utils';
import { useForm, Controller } from 'react-hook-form';
import { updateContent } from '@/app/services/contents/updateContent';
import ObjectId from 'bson-objectid';

export type ContentFormData = {
	_id: string;
	name: string;
	title: string;
	body: string;
	url?: string;
	images: ImagePickerItem[];
	files: File[];
};

interface ContentFormProps {
	initialContent?: Content;
	isNew?: boolean;
}

export default function ContentForm({ initialContent, isNew = false }: ContentFormProps) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const alertPush = useSystemAlertStore(state => state.push);

	const {
		register,
		handleSubmit,
		control,
		formState: { errors: _errors },
		setValue
	} = useForm<ContentFormData>({
		defaultValues: {
			_id: initialContent?._id.toString() ?? new ObjectId().toString(),
			name: initialContent?.name ?? '',
			title: initialContent?.title ?? '',
			body: initialContent?.body ?? '',
			url: initialContent?.url ?? '',
			images: convertImagePickerItems(initialContent?.images ?? []),
			files: []
		}
	});

	const onSubmit = async (data: ContentFormData) => {
		await updateContent(data, isNew);
		queryClient.invalidateQueries({
			queryKey: ['content']
		});
		router.push('/admin/content');
	};

	const handleDeleteContent = async () => {
		if (!initialContent?._id || isNew) return;
		const result = await deleteContent(initialContent._id.toString());
		if (result.success) {
			alertPush(result.message);
			router.push('/admin/content');
		}
	};

	return (
		<section className={`${styles.editForm} ${styles.contentForm}`}>
			<div className="inner">
				<header>
					<h3>{isNew ? '새 콘텐츠 추가' : '콘텐츠 수정'}</h3>
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
								required
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
										rows={10}
										maxLength={5000}
										{...field}
									/>
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
										onFilesChange={files => setValue('files', files)}
									/>
								)}
							/>
						</li>
					</ul>

					<div className={styles.formButtonWrap}>
						<div className={styles.left}>
							{!isNew && (
								<Button type="button" onClick={handleDeleteContent}>
									콘텐츠 삭제
								</Button>
							)}
						</div>

						<div className={styles.right}>
							<Button type="button" onClick={() => router.push('/admin/content')}>
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
