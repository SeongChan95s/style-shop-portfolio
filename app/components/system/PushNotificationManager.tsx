'use client';

import { useEffect, useState } from 'react';
import { Toast } from '../common/Toast';
import { registerServiceWorker, subscribeToPush } from '@/app/utils/pwa';
import { usePushNotificationStore } from '@/app/store';
import styles from './PushNotificationManager.module.scss';
import { isDev } from '@/app/utils/dev';
import { getCookie } from '@/app/utils/cookie';

export default function PushNotificationManager() {
	const subscription = usePushNotificationStore(state => state.subscription);
	const isSupported = usePushNotificationStore(state => state.isSupported);
	const [isClosed, setIsClosed] = useState(false);

	useEffect(() => {
		if (!isDev()) registerServiceWorker();

		const closed = getCookie('popup') ?? '';
		if (closed.indexOf('push') != -1) {
			setIsClosed(true);
		}
	}, []);

	const isVisible = subscription === null ? true : false;

	if (isSupported) {
		console.log('푸시알림을 지원하지 않는 브라우저입니다.');
		return <></>;
	}

	return (
		<Toast
			isVisible={isVisible}
			button={
				<button className={styles.subscribeButton} onClick={subscribeToPush}>
					알림설정
				</button>
			}>
			<p>알림을 구독하면 더 많은 소식을 받아볼 수 있습니다.</p>
		</Toast>
	);
}
