import { AppBar } from '../../common/AppBar';
import { Button } from '../../common/Button';
import styles from './SubmitBar.module.scss';

interface SubmitBarProps {
	className?: string;
	label?: React.ReactNode;
	type?: 'button' | 'submit';
	onClick?: (e: React.MouseEvent) => void;
	form?: string;
	formAction?: (formData: FormData) => void;
	disabled?: boolean;
}

export default function SubmitBar({
	className,
	type = 'submit',
	label = '완료',
	onClick,
	form,
	formAction,
	disabled = false
}: SubmitBarProps) {
	const disabledClass = disabled ? styles.disabled : '';

	return (
		<AppBar className={`${styles.submitBar} ${disabledClass} ${className}`}>
			<Button
				type={type}
				size="lg"
				shape="rect"
				fill
				onClick={onClick}
				formAction={formAction}
				form={form}
				disabled={disabled}>
				{label}
			</Button>
		</AppBar>
	);
}
