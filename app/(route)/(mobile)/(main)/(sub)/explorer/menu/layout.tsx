'use client';

import TabIndicator from '@/app/components/common/Tab/TabIndicator';
import { Tab } from '@/app/components/common/Tab';
import styles from './menu.module.scss';
import { createTransitionClassNames } from '@/app/utils/convert';

interface ExplorerLayoutProps {
	category: React.ReactNode;
	quick: React.ReactNode;
	children: React.ReactNode;
}

export default function ExplorerMenuLayout({
	category,
	quick,
	children
}: ExplorerLayoutProps) {
	return (
		<div className={styles.explorerLayout}>
			<Tab
				className={styles.tab}
				defaultKey="quick"
				transitionClassName={createTransitionClassNames('slide')}
				timeout={400}>
				<nav className={styles.stickyMenu}>
					<Tab.Header>
						<Tab.Pane eventKey="quick">빠른찾기</Tab.Pane>
						<Tab.Pane eventKey="category">카테고리</Tab.Pane>

						<TabIndicator />
					</Tab.Header>
				</nav>

				<Tab.Body className={styles.depth01TabBody}>
					<Tab.Item className={styles.depth01TabItem} eventKey="quick">
						{quick}
					</Tab.Item>
					<Tab.Item className={styles.depth01TabItem} eventKey="category">
						{category}
					</Tab.Item>
				</Tab.Body>
			</Tab>
			{children}
		</div>
	);
}
