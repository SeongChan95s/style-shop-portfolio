import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
	const headersList = await headers();
	const userAgent = headersList.get('user-agent') || '';

	// iOS 감지 (iPhone, iPad, iPod)
	const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

	// 디스플레이 모드 결정
	let displayMode: 'fullscreen' | 'minimal-ui' | 'standalone' = 'standalone';
	if (isIOS) {
		displayMode = 'fullscreen';
	}

	return {
		name: 'STYLE SHOP',
		short_name: 'STYLE',
		description: '나만의 스타일, 감성 소품샵',
		start_url: '/home',
		display: displayMode,
		orientation: 'portrait',
		background_color: '#000000',
		theme_color: '#000000',
		icons: [
			{
				src: '/settings/icon_app_192x192.png',
				sizes: '192x192',
				type: 'image/png'
			},
			{
				src: '/settings/icon_app_512x512.png',
				sizes: '512x512',
				type: 'image/png'
			}
		],
		screenshots: [
			{
				src: '/settings/screenshots/home_mobile.png',
				sizes: '1080x1920',
				type: 'image/png',
				form_factor: 'narrow'
			},
			{
				src: '/settings/screenshots/home_desktop.png',
				sizes: '1920x1080',
				type: 'image/png',
				form_factor: 'wide'
			}
		]
	};
}
