'use client';

import { classNames } from '@/app/utils';
import { IconArrowTrim } from '../Icon';
import { useAccordion } from './Accordion.hooks';
import styles from './Accordion.module.scss';

interface AccordionHeaderProps {
	className?: string;
	icon?: boolean;
	children?: React.ReactNode;
}

export default function AccordionHeader({
	icon = true,
	className: classNameProp,
	children
}: AccordionHeaderProps) {
	const { isOpen, setIsOpen } = useAccordion();
	const className = classNames(styles.header, classNameProp);

	return (
		<div className={className} onClick={() => setIsOpen(!isOpen)}>
			{children}
			{icon && <IconArrowTrim className={styles.arrow} />}
		</div>
	);
}
