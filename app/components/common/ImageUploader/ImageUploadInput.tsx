import { useRef, useState } from 'react';
import { IconIncrease } from '../Icon';
import { classNames } from '@/app/utils';
import styles from './ImageUploader.module.scss';

interface ImageUploadInputProps {
	onAdd: (files: FileList) => void;
	disabled: boolean;
}

export default function ImageUploadInput({ onAdd, disabled }: ImageUploadInputProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [dragOver, setDragOver] = useState(false);

	const className = classNames(styles.label, dragOver && 'drag-over');

	return (
		<div
			className={className}
			onDragOver={e => {
				e.preventDefault();
				setDragOver(true);
			}}
			onDragLeave={() => setDragOver(false)}
			onDrop={e => {
				e.preventDefault();
				setDragOver(false);
				if (!disabled && e.dataTransfer.files.length > 0) {
					onAdd(e.dataTransfer.files);
				}
			}}
			onClick={() => !disabled && inputRef.current?.click()}>
			<input
				ref={inputRef}
				type="file"
				accept="image/*"
				multiple
				onChange={e => {
					if (!disabled && e.target.files) onAdd(e.target.files);
				}}
				disabled={disabled}
			/>
			<IconIncrease />
		</div>
	);
}
