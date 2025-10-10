'use client';

import { classNames } from '@/app/utils';
import styles from './ColorPicker.module.scss';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

export const useColorPicker = (category: string) => {
	const router = useRouter();

	const changeColorPicker = (id: string) => {
		router.replace(`/details/${category}/${id}`);
	};

	return { changeColorPicker };
};

interface ColorPickerProps {
	className?: string;
	size?: 'sm' | 'md' | 'lg';
	colors: string[];
	category: string;
	productItemsId: string[];
	onChange?: (index: number) => void;
}

export function ColorPicker({
	className: classNameProp,
	size = 'md',
	colors,
	category,
	productItemsId,
	onChange
}: ColorPickerProps) {
	const { changeColorPicker } = useColorPicker(category);

	const className = classNames(
		styles.colorPicker,
		styles[size],
		'color-picker',
		classNameProp
	);

	const uniqueColorPairs = useMemo(() => {
		const seen = new Set<string>();
		const pairs: [string, string][] = [];
		colors.forEach((color, idx) => {
			if (!seen.has(color)) {
				seen.add(color);
				pairs.push([color, productItemsId[idx]]);
			}
		});
		return pairs;
	}, [colors, productItemsId]);

	return (
		<ul className={className}>
			{uniqueColorPairs.map(([color, id], i) => (
				<li
					className={styles[color]}
					key={`${color}_${id}`}
					onClick={e => {
						e.preventDefault();
						e.stopPropagation();
						changeColorPicker(id);
						onChange?.(i);
					}}></li>
			))}
		</ul>
	);
}
