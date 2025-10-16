'use client';

import { TabBar } from '@/app/components/global/Nav';
import { AppInstallNotification } from '@/app/components/system';

export default function MainLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<main>{children}</main>
			<AppInstallNotification />
			<TabBar />
		</>
	);
}
