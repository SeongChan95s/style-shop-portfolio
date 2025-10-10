'use client';

import { IconList } from '@/app/components/common/Icon';
import { IconButton } from '@/app/components/common/IconButton';
import { useSideSheetStore } from '../../(route)/(desktop)/admin/AdminSideSheet';

export default function AdminSideSheetButton() {
	return (
		<IconButton onClick={() => useSideSheetStore.getState().setIsOpen(true)}>
			<IconList />
		</IconButton>
	);
}
