'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconDarkMode, IconLightMode } from '@/app/components/common/Icon';
import { IconButton } from '../common/IconButton';

export default function DarkModeButton() {
	const router = useRouter();
	const [mode, setMode] = useState('');

	useEffect(() => {
		const cookie = ('; ' + document.cookie)
			.split(`; mode=`)
			.pop()
			?.split(';')[0] as string;

		// 쿠키 초기화
		if (cookie == '') {
			document.cookie = `mode=light; max-age=` + 3600 * 24 * 400;
		}

		// 상태 초기화
		if (mode == '') {
			setMode(cookie);
		}

		router.refresh();
	}, [mode]);

	const toggleDarkMode = () => {
		const cookie = ('; ' + document.cookie).split(`; mode=`).pop()?.split(';')[0];

		if (cookie == 'light') {
			setMode('dark');
			document.cookie = `mode=dark; max-age=` + 3600 * 24 * 400;
		} else {
			setMode('light');
			document.cookie = `mode=light; max-age=` + 3600 * 24 * 400;
		}
	};

	return (
		<>
			{mode == 'dark' ? (
				<IconButton onClick={toggleDarkMode} size="lg">
					<IconDarkMode />
				</IconButton>
			) : (
				<IconButton onClick={toggleDarkMode} size="lg">
					<IconLightMode />
				</IconButton>
			)}
		</>
	);
}
