import { classNames } from '@/app/utils';
import styles from './AppBar.module.scss';

export default function AppBar({
	id = '',
	className: classNameProp,
	children
}: {
	id?: string;
	className?: string;
	children: React.ReactNode;
}) {
	// height를 지정해주세요.
	const className = classNames(styles.appBar, 'app-bar', classNameProp);
	const containerClassName = classNames(styles.container, 'app-bar-container');

	return (
		<div id={id} className={className}>
			<div className={containerClassName}>{children}</div>
		</div>
	);
}
