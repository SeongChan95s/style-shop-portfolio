'use client';

import { SideSheetStore } from '@/app/components/common/SideSheet/useSideSheet';
import { create } from 'zustand';
import { List } from '@/app/components/common/List';
import { useRouter } from 'next/navigation';
import styles from './admin.module.scss';
import { Accordion } from '@/app/components/common/Accordion';

export const useSideSheetStore = create<SideSheetStore>(set => ({
	isOpen: false,
	setIsOpen: value => {
		set({ isOpen: value });
	}
}));

export default function AdminSideSheet() {
	const router = useRouter();

	return (
		<aside className={styles.adminSideSheet}>
			<div className="inner">
				<List variant="divider">
					<List.Item>대시보드</List.Item>
					<List.Item onClick={() => router.push('/admin/product')}>상품</List.Item>
					<List.Item onClick={() => router.push('/admin/brand')}>브랜드</List.Item>
					<List.Item onClick={() => router.push('/admin/review')}>리뷰</List.Item>
					<List.Item className={styles.depth01}>
						<Accordion>
							<Accordion.Header>컨텐츠</Accordion.Header>
							<Accordion.Body className={styles.depth02}>
								<List variant="divider">
									<List.Item
										className={styles.depth02Item}
										onClick={() => router.push('/admin/content')}>
										일반
									</List.Item>
									<List.Item
										className={styles.depth02Item}
										onClick={() => router.push('/admin/content/magazine')}>
										매거진
									</List.Item>
								</List>
							</Accordion.Body>
						</Accordion>
					</List.Item>
				</List>
			</div>
		</aside>
	);
}
