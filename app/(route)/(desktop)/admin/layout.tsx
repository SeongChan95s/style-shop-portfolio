import AdminSideSheet from './AdminSideSheet';
import styles from './admin.module.scss';

interface AdminLayoutProps {
	children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
	return (
		<div className={styles.adminLayout}>
			<AdminSideSheet />
			<main>{children}</main>
		</div>
	);
}
