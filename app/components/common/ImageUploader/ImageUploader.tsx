import Image from 'next/image';
import { IconClose } from '../Icon';
import { IconButton } from '../IconButton';
import { getFileFormat } from '@/app/utils/utils';
import { useState } from 'react';
import { MySwiper } from '../Swiper';
import { classNames } from '@/app/utils';
import styles from './ImageUploader.module.scss';
import ImageUploaderGallery from './ImageUploaderGallery';
import ImageUploadInput from './ImageUploadInput';
import { useImageUploaderStore } from './ImageUploader.store';
import type { Image as ImageType, ImageUploaderProps } from './ImageUploader.types';

export type { Image } from './ImageUploader.types';

export default function ImageUploader({
	value,
	name,
	onChange,
	onFormData,
	maxCount,
	startPath,
	maxSizeMB = 5,
	acceptExts = ['jpg', 'jpeg', 'png', 'webp'],
	swiper = false,
	dragdrop = false,
	gallery
}: ImageUploaderProps) {
	const [dragIdx, setDragIdx] = useState<number | null>(null);
	const formData = new FormData();
	value.forEach((img, i) => {
		if (img.file) formData.append(`images_${i}`, img.file);
	});

	const handleDragOver = (from: number | null, to: number) => (e: React.DragEvent) => {
		e.preventDefault();

		if (dragdrop && from !== null && from !== to) {
			if (from === to) return;
			const arr = value.filter(img => img.state !== 'deleted');
			const [moved] = arr.splice(from, 1);
			arr.splice(to, 0, moved);

			const result: ImageType[] = [];
			let reorderIdx = 0;
			for (let i = 0; i < value.length; i++) {
				if (value[i].state === 'deleted') {
					result.push(value[i]);
				} else {
					result.push(arr[reorderIdx++]);
				}
			}
			onChange(result);

			onFormData?.(formData);

			setDragIdx(to);
		}
	};

	const dragOverOpacity = (i: number) => ({
		opacity: dragIdx === i ? 0.5 : 1
	});

	const handleAddFiles = (files: FileList) => {
		const arr = Array.from(files);
		const currentCount = value.filter(img => img.state !== 'deleted').length;

		if (maxCount && currentCount + arr.length > maxCount) return;
		const validFiles = arr.filter(file => {
			const ext = getFileFormat(file.name).toLowerCase();
			const sizeMB = file.size / 1024 / 1024;
			return acceptExts.includes(ext) && sizeMB <= maxSizeMB;
		});

		const addedImages: ImageType[] = validFiles.map(file => {
			const format = getFileFormat(file.name);
			const pureFileName = file.name.split('.')[0];

			const galleryImages = useImageUploaderStore.getState().gallery;
			const duplicate = Array.isArray(galleryImages)
				? galleryImages.filter(img => img.indexOf(pureFileName) !== -1)
				: [];

			if (duplicate.length > 0) {
				return {
					key: `${duplicate[0]}`, // 파일명 그대로
					file: null,
					blob: window.URL.createObjectURL(file),
					state: 'existing'
				};
			}

			const modifiedFileName = Date.now() + '_' + Math.random().toString(36).slice(2, 8);
			return {
				key: `${startPath}/${modifiedFileName}.${format}`,
				file,
				blob: window.URL.createObjectURL(file),
				state: 'uploaded'
			};
		});
		onChange([...value, ...addedImages]);
		onFormData?.(formData);
	};

	const handleDelete = (idx: number) => {
		const img = value[idx];
		if (img.state === 'initial') {
			onChange(
				value.map((v, i) => (i === idx ? { ...v, state: 'deleted', file: null } : v))
			);
		} else {
			onChange([...value.slice(0, idx), ...value.slice(idx + 1)]);
		}

		onFormData?.(formData);
	};

	const canAdd =
		!maxCount || value.filter(img => img.state !== 'deleted').length < maxCount;

	const className = classNames(styles.imageUploader, swiper && styles.swiper);

	return (
		<div className={className}>
			{swiper ? (
				<MySwiper className={styles.imageWrap} slidesPerView={3} inner>
					{canAdd && <ImageUploadInput onAdd={handleAddFiles} disabled={!canAdd} />}
					{value
						.filter(img => img.state !== 'deleted')
						.map((image, i) => (
							<div
								className={styles.item}
								key={image.key}
								style={{ opacity: dragIdx === i ? 0.5 : 1 }}>
								<IconButton
									className={styles.deleteButton}
									onClick={e => {
										e.stopPropagation();
										handleDelete(i);
									}}>
									<IconClose />
								</IconButton>
								<Image
									src={image.blob}
									alt={`${i}번째 업로드 미리보기`}
									fill
									sizes="30%"
								/>
							</div>
						))}
				</MySwiper>
			) : (
				<div className={styles.imageWrap}>
					{canAdd && <ImageUploadInput onAdd={handleAddFiles} disabled={!canAdd} />}
					{value
						.filter(img => img.state !== 'deleted')
						.map((image, i) => (
							<div
								className={styles.item}
								key={image.key}
								draggable={dragdrop}
								onDragStart={() => setDragIdx(i)}
								onDragOver={handleDragOver(dragIdx, i)}
								onDragEnd={() => setDragIdx(null)}
								style={dragOverOpacity(i)}>
								<IconButton
									className={styles.deleteButton}
									onClick={e => {
										e.stopPropagation();
										handleDelete(i);
									}}>
									<IconClose />
								</IconButton>
								<Image
									src={image.blob}
									alt={`${i}번째 업로드 미리보기`}
									fill
									sizes="30%"
								/>
							</div>
						))}
				</div>
			)}
			<input
				type="hidden"
				name={name}
				value={value
					.filter(v => v.state != 'deleted')
					.map(v => v.key)
					.join(',')}
			/>
			{gallery && <ImageUploaderGallery path={startPath} />}
		</div>
	);
}
