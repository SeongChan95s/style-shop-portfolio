'use client';

import { useEffect, useRef, useState } from 'react';
import { IconStarFilled, IconStarHalf } from '../common/Icon';
import styles from './ScoreRating.module.scss';
import { classNames } from '@/app/utils';

interface ScoreRatingProps {
	value?: number;
	defaultValue?: number;
	name?: string;
	onChange?: (value: number) => void;
	size?: 'sm' | 'md' | 'lg';
	readOnly?: boolean;
	className?: string;
}

export default function ScoreRating({
	value: controlledValue,
	defaultValue = 0,
	name,
	onChange,
	size = 'md',
	readOnly = false,
	className: classNameProp
}: ScoreRatingProps) {
	const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
	const containerRef = useRef<HTMLDivElement>(null);

	const isControlled = controlledValue != undefined;
	const value = isControlled ? controlledValue : uncontrolledValue;
	const setValue = (value: number) => {
		if (!isControlled) setUncontrolledValue(value);
		onChange?.(value);
	};

	useEffect(() => {
		onChange?.(value);
	}, []);

	const getStarValue = (clientX: number) => {
		const rect = containerRef.current?.getBoundingClientRect();
		if (!rect) return value;
		let x = clientX - rect.left;
		x = Math.max(0, Math.min(rect.width, x));
		const raw = (x / rect.width) * 5;
		return Math.round(raw * 2) / 2;
	};

	const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		if (readOnly) return;
		const newValue = getStarValue(e.clientX);
		setValue(newValue);
		window.addEventListener('pointermove', handlePointerMove);
		window.addEventListener('pointerup', handlePointerUp);
	};

	const handlePointerMove = (e: PointerEvent) => {
		if (readOnly) return;
		const newValue = getStarValue(e.clientX);
		setValue(newValue);
	};

	const handlePointerUp = (e: PointerEvent) => {
		if (readOnly) return;
		window.removeEventListener('pointermove', handlePointerMove);
		window.removeEventListener('pointerup', handlePointerUp);
	};

	let color = 'var(--deactivated-color)';

	const className = classNames(
		styles.scoreRating,
		styles[size],
		readOnly && styles.readOnly,
		classNameProp
	);

	return (
		<div
			ref={containerRef}
			className={className}
			tabIndex={readOnly ? -1 : 0}
			onPointerDown={handlePointerDown}
			style={{ touchAction: 'none' }}>
			{[0, 1, 2, 3, 4].map(idx => {
				let Icon;
				if (idx < Math.floor(value)) {
					Icon = IconStarFilled;
					color = 'var(--activated-color)';
				} else if (idx === Math.floor(value) && value % 1 >= 0.5) {
					Icon = IconStarHalf;
					color = 'var(--activated-color)';
				} else {
					Icon = IconStarFilled;
					color = 'var(--deactivated-color)';
				}
				return <Icon key={idx} className={styles.star} size={size} color={color} />;
			})}
			<input type="hidden" value={value} name={name} />
		</div>
	);
}
