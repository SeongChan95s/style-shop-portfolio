'use client';

import { useEffect, useState } from 'react';
import { Toast } from '../common/Toast';
import styles from './AppInstallNotification.module.scss';
import Image from 'next/image';
import { Button } from '../common/Button';
import { IconButton } from '../common/IconButton';
import { IconClose } from '../common/Icon';
import { getCookie, pushCookie } from '@/app/utils/cookie';
import { checkIsApp } from '@/app/utils/pwa';

interface BeforeInstallPromptEvent extends Event {
	readonly platforms: string[];
	readonly userChoice: Promise<{
		outcome: 'accepted' | 'dismissed';
		platform: string;
	}>;
	prompt(): Promise<void>;
}

export default function AppInstallNotification() {
	const [isIOS, setIsIOS] = useState(false);
	const [isApp, setIsApp] = useState(false);
	const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
		null
	);
	const [showInstall, setShowInstall] = useState(false);

	useEffect(() => {
		const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
			e.preventDefault();
			setDeferredPrompt(e);
		};

		window.addEventListener(
			'beforeinstallprompt',
			handleBeforeInstallPrompt as EventListener
		);

		setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window));
		setIsApp(checkIsApp());

		const closed = getCookie('popup') ?? '';
		if (closed.indexOf('appInstall') == -1) {
			setShowInstall(true);
		}

		return () => {
			window.removeEventListener(
				'beforeinstallprompt',
				handleBeforeInstallPrompt as EventListener
			);
		};
	}, []);

	const handleClose = () => {
		pushCookie('popup', 'appInstall', { maxAge: 60 * 60 * 24 * 30 });
		setShowInstall(false);
	};

	const handleInstall = async () => {
		if (deferredPrompt) {
			deferredPrompt.prompt();
			await deferredPrompt.userChoice.then(choiceResult => {
				if (choiceResult.outcome === 'accepted') {
					// console.log('사용자가 PWA 설치를 수락했습니다.');
				} else {
					// console.log('사용자가 앱 설치를 동의하지 않았습니다.');
				}
				setDeferredPrompt(null);
				handleClose();
			});
		}
	};

	if (isApp) {
		return null;
	}

	if (isIOS)
		return (
			<Toast isVisible={true}>
				사파리 브라우저에서 하단 공유버튼 클릭&gt;홈 화면에 추가하여 편리하게 이용하세요.
			</Toast>
		);

	if (!showInstall) {
		return null;
	}

	return (
		<aside className={styles.appInstallNotification}>
			<div className={styles.inner}>
				<header>
					<div className={styles.appIcon}>
						<Image
							src="/settings/icon_app_512x512.png"
							width="36"
							height="36"
							alt="앱 아이콘"
						/>
					</div>
					<h3>앱으로 쉽고 빠르게 이용하세요!</h3>
				</header>
				<div className={styles.buttonWrap}>
					<Button onClick={handleInstall} variant="outlined" size="xs">
						설치하기
					</Button>
					<IconButton size="sm" onClick={handleClose}>
						<IconClose className={styles.closeIcon} />
					</IconButton>
				</div>
			</div>
		</aside>
	);
}
