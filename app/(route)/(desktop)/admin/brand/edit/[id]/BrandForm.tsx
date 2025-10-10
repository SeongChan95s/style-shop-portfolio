'use client';

import { Input } from '@/app/components/common/Input';
import { Textarea } from '@/app/components/common/Textarea';
import { Select } from '@/app/components/common/Select';
import { Button } from '@/app/components/common/Button';
import { useActionState, useEffect, useRef } from 'react';
import { useSystemAlertStore } from '@/app/store';
import { useQueryClient } from '@tanstack/react-query';
import { updateBrandAction } from '@/app/actions/brand/updateBrandAction';
import ImagePicker from '@/app/components/common/ImagePicker';
import { deleteBrandById } from '@/app/services/brand/deleteBrandById';
import { useRouter } from 'next/navigation';
import { Brand } from '@/app/types';
import styles from './../../../admin.module.scss';
import { convertImagePickerItems } from '@/app/components/common/ImagePicker/ImagePicker.utils';

interface BrandFormProps {
	initialBrand: Brand;
	isNew?: boolean;
}

export default function BrandForm({ initialBrand, isNew = false }: BrandFormProps) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const isFirstRender = useRef(true);

	const [state, action, _isPending] = useActionState(updateBrandAction, {
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
			queryClient.invalidateQueries({ queryKey: ['brand'] });
			router.push('/admin/brand');
		}
	}, [state, queryClient, router]);

	const handleDeleteBrand = async () => {
		if (!initialBrand?._id || isNew) return;
		const result = await deleteBrandById(initialBrand._id);
		if (result.success) {
			useSystemAlertStore.getState().push(result.message);
			router.push('/admin/brand');
		}
	};

	return (
		<div className={styles.productEditPage}>
			<div className="inner">
				<header>
					<h3>{isNew ? '새 브랜드 추가' : '브랜드 수정'}</h3>
				</header>

				<form action={action}>
					<ul className={styles.groupWrap}>
						<li className={styles.id}>
							<Input
								defaultValue={initialBrand?._id}
								name="_id"
								label="id"
								variant="outlined"
								fill
								readOnly
							/>
						</li>
						<li className={styles.name}>
							<Input
								defaultValue={initialBrand?.name.main}
								name="name.main"
								label="브랜드명"
								variant="outlined"
								fill
							/>
						</li>
						<li className={styles.brand}>
							<Select
								fill
								variant="outlined"
								name="country"
								defaultValue={initialBrand.country}>
								<Select.Input label="국가" />
								<Select.Container>
									<Select.Option value="대한민국">대한민국</Select.Option>
									<Select.Option value="미국">미국</Select.Option>
								</Select.Container>
							</Select>
						</li>
						<li className={styles.name}>
							<Input
								defaultValue={initialBrand?.name.sub}
								name="name.sub"
								label="별칭(영문 등)"
								variant="outlined"
								fill
							/>
						</li>
						<li className={styles.price}>
							<Input
								type="number"
								defaultValue={initialBrand.since?.toString()}
								name="since"
								label="설립연도"
								variant="outlined"
								fill
							/>
						</li>
						<li className={styles.category}>
							<h5>소개</h5>
							<Textarea
								defaultValue={initialBrand.desc}
								name="desc"
								label="소개"
								count
								fill
								maxLength={300}
							/>
						</li>
						<li className={styles.keywords}>
							<h5>이미지</h5>
							<ImagePicker
								name="images"
								defaultValue={convertImagePickerItems(initialBrand.images)}
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
