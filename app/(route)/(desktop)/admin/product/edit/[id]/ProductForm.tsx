'use client';

import { ProductItem, ProductNested } from '@/app/types';
import { Input } from '@/app/components/common/Input';
import { Button } from '@/app/components/common/Button';
import { StackField } from '@/app/components/common/StackField';
import { useSystemAlertStore } from '@/app/store';
import { useQueries, useQueryClient } from '@tanstack/react-query';
import { deleteProductGroupById } from '@/app/services/product/deleteProductGroupById';
import { Select } from '@/app/components/common/Select';
import { getBrands } from '@/app/services/brand/getBrands';
import { useRouter } from 'next/navigation';
import { getProductFilter } from '@/app/services/explorer/getProductFilter';
import { useForm, Controller } from 'react-hook-form';
import { convertImagePickerItems } from '@/app/components/common/ImagePicker/ImagePicker.utils';
import { ImagePickerItem } from '@/app/components/common/ImagePicker/ImagePicker';
import ObjectId from 'bson-objectid';
import styles from './../../../admin.module.scss';
import { updateProduct } from '@/app/services/product/updateProduct';
import ItemTable from './ItemTable';

interface ProductFormProps {
	initialProduct?: ProductNested;
	isNew?: boolean;
}

export type ProductFormItem = Omit<ProductItem, 'images'> & {
	state?: 'initial' | 'create' | 'delete';
	images: ImagePickerItem[];
};

export type ProductFormData = {
	_id: string;
	name: string;
	brand: string;
	price: {
		cost: number;
		discount: number;
	};
	category: {
		gender: string;
		type: string;
		part: string;
		main: string;
	};
	keywords: string[];
	items: ProductFormItem[];
	files: File[];
};

export default function ProductForm({ initialProduct, isNew = false }: ProductFormProps) {
	const router = useRouter();

	const {
		register,
		handleSubmit,
		control,
		formState: { errors: _errors },
		watch,
		setValue,
		getValues
	} = useForm<ProductFormData>({
		defaultValues: {
			_id: initialProduct?._id ?? new ObjectId().toString(),
			name: initialProduct?.name ?? '',
			brand: initialProduct?.brand ?? '',
			price: {
				cost: initialProduct?.price?.cost ?? 0,
				discount: initialProduct?.price?.discount ?? 0
			},
			category: initialProduct?.category ?? {},
			keywords: initialProduct?.keywords ?? [],
			items:
				initialProduct?.items.map(item => ({
					...item,
					images: convertImagePickerItems(item.images),
					state: 'initial'
				})) ?? []
		}
	});

	const results = useQueries({
		queries: [
			{
				queryFn: () => getBrands({}),
				queryKey: ['brand']
			},
			{
				queryFn: () => getProductFilter(),
				queryKey: ['product', 'category', 'filter']
			}
		]
	});

	const brands = results[0]?.data?.success ? results[0].data.data : [];
	const categories = results[1]?.data?.success ? results[1].data.data : {};

	const queryClient = useQueryClient();
	const alertPush = useSystemAlertStore(state => state.push);

	const handleDeleteProductGroup = async () => {
		if (isNew) return;

		const result = await deleteProductGroupById(getValues('_id'));
		if (result.success) {
			alertPush(result.message);
			queryClient.invalidateQueries({
				queryKey: ['product']
			});
			router.push('/admin/product');
		}
	};

	const handleAddProductItem = () => {
		const newItemData = newItem(new ObjectId().toString());
		const currentItems = getValues('items') || [];
		const updatedItems = [...currentItems, newItemData];
		setValue('items', updatedItems);
	};

	const newItem = (id: string): ProductFormItem => ({
		_id: id,
		groupId: getValues('_id'),
		images: [],
		option: {
			size: '',
			color: ''
		},
		stock: '0',
		state: 'create'
	});

	const handleDuplicateItem = (item: ProductFormItem) => {
		const copyItem = {
			...item,
			_id: new ObjectId().toString(),
			state: 'create' as const
		};
		const currentItems = getValues('items') || [];
		const updatedItems = [...currentItems, copyItem];
		setValue('items', updatedItems);
	};

	const handleDeleteItem = (itemId: string) => {
		const currentItems = getValues('items') || [];
		let updatedItems;

		const existedItem = initialProduct?.items.filter(item => item._id == itemId);
		if (existedItem?.length == 0) {
			updatedItems = currentItems.filter(item => item._id != itemId);
		} else {
			updatedItems = currentItems.map(item =>
				item._id === itemId ? { ...item, state: 'delete' as const } : item
			);
		}

		setValue('items', updatedItems);
	};

	const onSubmit = async (data: ProductFormData) => {
		await updateProduct(data);
		queryClient.invalidateQueries({
			queryKey: ['product']
		});
	};

	return (
		<div className={`${styles.editForm} ${styles.productForm}`}>
			<header>
				<h3>{isNew ? '새 상품 추가' : '상품 수정'}</h3>
			</header>

			<form
				action="/api/product/updateProduct"
				method="PUT"
				onSubmit={handleSubmit(onSubmit)}>
				<ul className={styles.groupWrap}>
					<li className={styles.id}>
						<Input
							{...register('_id')}
							label="식별코드"
							variant="outlined"
							readOnly
							fill
						/>
					</li>
					<li className={styles.name}>
						<Input {...register('name')} label="상품명" variant="outlined" fill />
					</li>
					<li className={styles.brand}>
						<Controller
							name="brand"
							control={control}
							render={({ field }) => (
								<Select {...field} fill variant="outlined">
									<Select.Input label="브랜드명" />
									<Select.Container>
										{brands.map(brand => (
											<Select.Option key={brand._id} value={brand.name.main}>
												{brand.name.main}
											</Select.Option>
										))}
										<Select.Option value="직접 입력" enableTextField>
											직접 입력
										</Select.Option>
									</Select.Container>
								</Select>
							)}
						/>
					</li>
					<li className={styles.price}>
						<h5>가격</h5>
						<ul>
							<li>
								<Input
									{...register('price.cost')}
									type="number"
									label="원가"
									variant="outlined"
									fill
								/>
							</li>
							<li>
								<Input
									{...register('price.discount')}
									type="number"
									label="할인율(%)"
									variant="outlined"
									fill
								/>
							</li>
						</ul>
					</li>
					<li className={styles.category}>
						<h5>카테고리</h5>

						{results[1].isSuccess && (
							<ul>
								<li>
									<Controller
										name="category.main"
										control={control}
										render={({ field }) => (
											<Select {...field} variant="outlined" fill>
												<Select.Input label="분류" />
												<Select.Container>
													{categories.main.map(category => (
														<Select.Option key={category} value={category}>
															{category}
														</Select.Option>
													))}
													<Select.Option value="직접 입력" enableTextField>
														직접 입력
													</Select.Option>
												</Select.Container>
											</Select>
										)}
									/>
								</li>
								<li>
									<Controller
										name="category.gender"
										control={control}
										render={({ field }) => (
											<Select {...field} variant="outlined" fill>
												<Select.Input label="성별" />
												<Select.Container>
													{categories.gender.map(category => (
														<Select.Option key={category} value={category}>
															{category}
														</Select.Option>
													))}
													<Select.Option value="직접 입력" enableTextField>
														직접 입력
													</Select.Option>
												</Select.Container>
											</Select>
										)}
									/>
								</li>
								<li>
									<Controller
										name="category.part"
										control={control}
										render={({ field }) => (
											<Select {...field} variant="outlined" fill>
												<Select.Input label="파츠" />
												<Select.Container>
													{categories.part.map(category => (
														<Select.Option key={category} value={category}>
															{category}
														</Select.Option>
													))}
													<Select.Option value="직접 입력" enableTextField>
														직접 입력
													</Select.Option>
												</Select.Container>
											</Select>
										)}
									/>
								</li>
								<li>
									<Controller
										name="category.type"
										control={control}
										render={({ field }) => (
											<Select {...field} variant="outlined" fill>
												<Select.Input label="타입" />
												<Select.Container>
													{categories.type.map(category => (
														<Select.Option key={category} value={category}>
															{category}
														</Select.Option>
													))}
													<Select.Option value="직접 입력" enableTextField>
														직접 입력
													</Select.Option>
												</Select.Container>
											</Select>
										)}
									/>
								</li>
							</ul>
						)}
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
				</ul>

				<div className={styles.bottom}>
					<ItemTable
						items={watch('items') || []}
						onDuplicateItem={handleDuplicateItem}
						onDeleteItem={handleDeleteItem}
						register={register}
						setValue={setValue}
					/>

					<div className={styles.formButtonWrap}>
						<div className={styles.left}>
							{!isNew && (
								<Button type="button" onClick={handleDeleteProductGroup}>
									그룹 삭제
								</Button>
							)}
							<Button type="button" onClick={handleAddProductItem}>
								아이템 추가
							</Button>
						</div>

						<div className={styles.right}>
							<Button type="button" onClick={() => router.push('/admin/product')}>
								목록으로
							</Button>
							<Button type="submit">저장</Button>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
}
