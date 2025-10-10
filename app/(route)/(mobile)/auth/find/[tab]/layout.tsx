'use client';

import { Tab } from '@/app/components/common/Tab';
import { notFound, useParams, useRouter } from 'next/navigation';
import styles from './../../auth.module.scss';

interface AuthFindLayoutProps {
	id: React.ReactNode;
	password: React.ReactNode;
	children: React.ReactNode;
}

export default function AuthFindLayout({ id, password, children }: AuthFindLayoutProps) {
	const { tab } = useParams<{ tab: string }>();
	const router = useRouter();
	if (tab != 'id' && tab != 'password') return notFound();

	return (
		<div className={styles.authFindLayout}>
			<Tab defaultKey={tab ?? 'id'}>
				<Tab.Header className={styles.tabHeader}>
					<Tab.Pane
						className={styles.tabPane}
						eventKey="id"
						onClick={() => router.replace('/auth/find/id')}>
						아이디 찾기
					</Tab.Pane>
					<Tab.Pane
						className={styles.tabPane}
						eventKey="password"
						onClick={() => router.replace('/auth/find/password')}>
						비밀번호 찾기
					</Tab.Pane>
				</Tab.Header>

				<Tab.Body>
					<Tab.Item eventKey="id">{id}</Tab.Item>
					<Tab.Item eventKey="password">{password}</Tab.Item>
				</Tab.Body>
			</Tab>
		</div>
	);
}
