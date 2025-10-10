'use client';

import { SideSheetStore } from '@/app/components/common/SideSheet/useSideSheet';
import { create } from 'zustand';
import { List } from '@/app/components/common/List';
import { useRouter } from 'next/navigation';
import styles from './admin.module.scss';

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
				</List>
			</div>
		</aside>
	);
}
