'use client';

import { useEffect, useState } from 'react';
import styles from './Badge.module.scss';
import { classNames } from '@/app/utils';

interface BadgeProps {
	count?: number;
	color?: 'red';
	size?: 'sm' | 'lg';
	children: React.ReactNode;
}

export default function Badge({
	count,
	size = 'sm',
	color = 'red',
	children
}: BadgeProps) {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		if (count == 0) {
			setIsVisible(false);
		} else if (count && count >= 1) {
			setIsVisible(true);
		}
	}, [count]);

	const className = classNames(styles.count, styles[size], styles[color]);

	return (
		<div className={styles.badge}>
			{isVisible && <span className={className}>{count && count}</span>}
			{children}
		</div>
	);
}
