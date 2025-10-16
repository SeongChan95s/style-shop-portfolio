'use client';

import { useState, forwardRef } from 'react';
import { IconClose, IconIncrease } from '@/app/components/common/Icon';
import styles from './StackField.module.scss';

interface StackFieldProps {
	value?: string[];
	onChange?: (value: string[]) => void;
	onBlur?: () => void;
	placeholder?: string;
	label?: string;
	name?: string;
}

const StackField = forwardRef<HTMLDivElement, StackFieldProps>(
	({ value = [], onChange, onBlur, placeholder = '입력 후 Enter', label, name }, ref) => {
		const [addMode, setAddMode] = useState(false);
		const [inputValue, setInputValue] = useState('');

		const handleAdd = () => {
			if (inputValue.length === 0) return;
			const newValue = [...value, inputValue];
			onChange?.(newValue);
			setInputValue('');
			setAddMode(false);
			onBlur?.();
		};

		const handleDelete = (item: string) => {
			const targetIndex = value.indexOf(item);
			const newValue = [...value.slice(0, targetIndex), ...value.slice(targetIndex + 1)];
			onChange?.(newValue);
			onBlur?.();
		};

		const handleCancel = () => {
			setAddMode(false);
			setInputValue('');
			onBlur?.();
		};

		return (
			<div className={styles.stackField} ref={ref}>
				{label && <h5>{label}</h5>}
				<ul className={styles.itemWrap}>
					{value &&
						Array.isArray(value) &&
						value.map(item => (
							<li className={styles.item} key={item}>
								<span>{item}</span>
								<IconClose size="sm" onClick={() => handleDelete(item)} />
							</li>
						))}
					<li
						className={`${styles.item} ${styles.itemToAdd} ${addMode && 'addMode'}`}
						onClick={() => {
							setAddMode(true);
						}}>
						{!addMode ? (
							<IconIncrease size="sm" />
						) : (
							<>
								<input
									className={styles.inputField}
									value={inputValue}
									onChange={e => {
										setInputValue(e.target.value);
									}}
									onKeyDown={e => {
										if (e.key === 'Enter') {
											e.preventDefault();
											handleAdd();
										}
									}}
									placeholder={placeholder}
									autoFocus
								/>
								<IconIncrease
									onClick={e => {
										e.stopPropagation();
										handleAdd();
									}}
									size="sm"
								/>
								<IconClose
									onClick={e => {
										e.stopPropagation();
										handleCancel();
									}}
									size="sm"
								/>
							</>
						)}
					</li>
				</ul>
			</div>
		);
	}
);

StackField.displayName = 'StackField';

export default StackField;
