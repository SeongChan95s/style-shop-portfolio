'use client';

import { AccordionProvider } from './AccordionProvider';
import { classNames } from '@/app/utils';
import { useState } from 'react';
import styles from './Accordion.module.scss';

interface AccordionMainProps {
	className?: string;
	open?: boolean;
	onChange?: (value: boolean) => void;
	children?: React.ReactNode;
}

export default function AccordionMain({
	className: classNameProp,
	open: controlledOpen,
	onChange,
	children
}: AccordionMainProps) {
	const [open, setOpen] = useState(false);

	const isControlled = controlledOpen != undefined;
	const isOpen = isControlled ? controlledOpen : open;

	const setIsOpen = (value: boolean) => {
		if (!isControlled) setOpen(value);
		onChange?.(value);
	};

	const className = classNames(styles.accordion, isOpen && 'open', classNameProp);

	return (
		<AccordionProvider value={{ isOpen, setIsOpen }}>
			<div className={className}>{children}</div>
		</AccordionProvider>
	);
}
