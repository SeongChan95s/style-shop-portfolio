'use client';

import { Input } from '@/app/components/common/Input';
import { Textarea } from '@/app/components/common/Textarea';
import { Select } from '@/app/components/common/Select';
import { Button } from '@/app/components/common/Button';
import { useSystemAlertStore } from '@/app/store';
import { useQueryClient } from '@tanstack/react-query';
import ImagePicker from '@/app/components/common/ImagePicker';
import { deleteBrandById } from '@/app/services/brand/deleteBrandById';
import { useRouter } from 'next/navigation';
import { Brand } from '@/app/types';
import styles from './../../../admin.module.scss';
import { convertImagePickerItems } from '@/app/components/common/ImagePicker/ImagePicker.utils';
import { useForm, Controller } from 'react-hook-form';
import { updateBrand } from '@/app/services/brand/updateBrand';
import { ImagePickerItem } from '@/app/components/common/ImagePicker/ImagePicker';
import ObjectId from 'bson-objectid';

export type BrandFormData = {
	_id: string;
	name: {
		main: string;
		sub: string;
	};
	country: string;
	since: number;
	desc: string;
	images: ImagePickerItem[];
	files: File[];
};

interface BrandFormProps {
	initialBrand?: Brand;
	isNew?: boolean;
}

export default function BrandForm({ initialBrand, isNew = false }: BrandFormProps) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const alertPush = useSystemAlertStore(state => state.push);

	const {
		register,
		handleSubmit,
		control,
		formState: { errors: _errors },
		setValue
	} = useForm<BrandFormData>({
		defaultValues: {
			_id: initialBrand?._id ?? new ObjectId().toString(),
			name: {
				main: initialBrand?.name.main ?? '',
				sub: initialBrand?.name.sub ?? ''
			},
			country: initialBrand?.country ?? '대한민국',
			since: initialBrand?.since ?? new Date().getFullYear(),
			desc: initialBrand?.desc ?? '',
			images: convertImagePickerItems(initialBrand?.images ?? []),
			files: []
		}
	});

	const onSubmit = async (data: BrandFormData) => {
		await updateBrand(data);
		queryClient.invalidateQueries({
			queryKey: ['brand']
		});
		router.push('/admin/brand');
	};

	const handleDeleteBrand = async () => {
		if (!initialBrand?._id || isNew) return;
		const result = await deleteBrandById(initialBrand._id);
		if (result.success) {
			alertPush(result.message);
			router.push('/admin/brand');
			queryClient.invalidateQueries({
				queryKey: ['brand']
			});
		}
	};

	return (
		<div className={styles.productEditPage}>
			<div className="inner">
				<header>
					<h3>{isNew ? '새 브랜드 추가' : '브랜드 수정'}</h3>
				</header>

				<form onSubmit={handleSubmit(onSubmit)}>
					<ul className={styles.groupWrap}>
						<li className={styles.id}>
							<Input {...register('_id')} label="id" variant="outlined" fill readOnly />
						</li>
						<li className={styles.name}>
							<Input
								{...register('name.main')}
								label="브랜드명"
								variant="outlined"
								fill
							/>
						</li>
						<li className={styles.brand}>
							<Controller
								name="country"
								control={control}
								render={({ field }) => (
									<Select {...field} fill variant="outlined">
										<Select.Input label="국가" />
										<Select.Container>
											<Select.Option value="대한민국">대한민국</Select.Option>
											<Select.Option value="미국">미국</Select.Option>
										</Select.Container>
									</Select>
								)}
							/>
						</li>
						<li className={styles.name}>
							<Input
								{...register('name.sub')}
								label="별칭(영문 등)"
								variant="outlined"
								fill
							/>
						</li>
						<li className={styles.price}>
							<Input
								{...register('since', { valueAsNumber: true })}
								type="number"
								label="설립연도"
								variant="outlined"
								fill
							/>
						</li>
						<li className={styles.category}>
							<h5>소개</h5>
							<Controller
								name="desc"
								control={control}
								render={({ field }) => (
									<Textarea label="소개" count fill maxLength={300} {...field} />
								)}
							/>
						</li>
						<li className={styles.keywords}>
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

					<div className={styles.bottom}>
						<div className={styles.bottomFrame}>
							<div className={styles.left}>
								{!isNew && (
									<Button type="button" onClick={handleDeleteBrand}>
										브랜드 삭제
									</Button>
								)}
							</div>

							<div className={styles.right}>
								<Button type="button" onClick={() => router.push('/admin/brand')}>
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
