'use client';

import { Input } from '@/app/components/common/Input';
import { IconButton } from '@/app/components/common/IconButton';
import { IconClose, IconIncrease, IconLight } from '@/app/components/common/Icon';
import { useState } from 'react';
import ImagePicker from '@/app/components/common/ImagePicker';
import styles from './../../../admin.module.scss';
import {
	UseFormRegister,
	UseFormSetValue
} from 'react-hook-form';
import { ProductFormData, ProductFormItem } from './ProductForm';

interface ItemTableRowProps {
	itemToOpenImagePicker?: string;
	item: ProductFormItem;
	index: number;
	register: UseFormRegister<ProductFormData>;
	setValue: UseFormSetValue<ProductFormData>;
	onOpenImagePicker: (itemid: string) => (e: React.MouseEvent) => void;
	onDuplicateItem: (item: ProductFormItem) => void;
	onDeleteItem: (itemId: string) => void;
}

function ItemTableRow({
	itemToOpenImagePicker: _itemToOpenImagePicker,
	item,
	index,
	register,
	setValue,
	onOpenImagePicker: handleOpenImagePicker,
	onDuplicateItem,
	onDeleteItem
}: ItemTableRowProps) {
	const duplicateItem = () => {
		if (item) {
			onDuplicateItem(item);
		}
	};

	const handleDeleteItem = (e: React.MouseEvent) => {
		e.preventDefault();
		if (item) {
			onDeleteItem(item._id);
		}
	};

	return (
		<>
			<tr style={{ display: item?.state == 'delete' ? 'none' : undefined }}>
				<td>
					<Input variant="outlined" readOnly {...register(`items.${index}._id`)} />
					<input type="hidden" {...register(`items.${index}.groupId`)} />
					{item?.state && (
						<input
							value={item?.state}
							type="hidden"
							{...register(`items.${index}.state`)}
						/>
					)}
				</td>
				<td>
					<Input
						variant="outlined"
						placeholder="컬러"
						{...register(`items.${index}.option.color`)}
					/>
				</td>
				<td>
					<Input
						variant="outlined"
						placeholder="사이즈"
						{...register(`items.${index}.option.size`)}
					/>
				</td>
				<td>
					<Input variant="outlined" {...register(`items.${index}.stock`)} />
				</td>
				<td>
					<IconButton
						className={styles.imageDialogButton}
						size="sm"
						onClick={handleOpenImagePicker(item._id)}>
						<IconLight />
					</IconButton>
				</td>
				<td>
					<div className={styles.buttonWrap}>
						<IconButton size="sm" onClick={duplicateItem}>
							<IconIncrease />
						</IconButton>
						<IconButton size="sm" onClick={handleDeleteItem}>
							<IconClose />
						</IconButton>
					</div>
				</td>
			</tr>

			<tr style={{ display: item?.state == 'delete' ? 'none' : undefined }}>
				<td colSpan={6}>
					<ImagePicker
						className={`${styles.imagePicker}`}
						value={item.images}
						onChange={value => setValue(`items.${index}.images`, value)}
						onFilesChange={files => {
							setValue('files', files);
						}}
					/>
				</td>
			</tr>
		</>
	);
}

interface ItemTableProps {
	items: ProductFormItem[];
	register: UseFormRegister<ProductFormData>;
	setValue: UseFormSetValue<ProductFormData>;
	onDuplicateItem: (item: ProductFormItem) => void;
	onDeleteItem: (itemId: string) => void;
}

export default function ItemTable({
	items,
	register,
	setValue,
	onDuplicateItem,
	onDeleteItem
}: ItemTableProps) {
	const [itemToOpenImagePicker, setItemToOpenImagePicker] = useState('');
	const handleOpenImagePicker = (itemId: string) => () => {
		setItemToOpenImagePicker(prev => (prev == itemId ? '' : itemId));
	};

	return (
		<div className={styles.itemTable}>
			<table>
				<colgroup>
					<col width="35%" />
					<col width="16%" />
					<col width="16%" />
					<col width="12%" />
					<col width="70px" />
					<col width="70px" />
				</colgroup>

				<thead>
					<tr>
						<th>식별코드</th>
						<th colSpan={2}>옵션</th>
						<th>재고</th>
						<th>이미지</th>
						<th>비고</th>
					</tr>
				</thead>
				<tbody>
					{items.map((item, i) => (
						<ItemTableRow
							item={item}
							key={`${item._id}_${i}`}
							index={i}
							register={register}
							setValue={setValue}
							itemToOpenImagePicker={itemToOpenImagePicker}
							onOpenImagePicker={handleOpenImagePicker}
							onDuplicateItem={onDuplicateItem}
							onDeleteItem={onDeleteItem}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
}
