import type { NextConfig } from 'next';
import withPWAInit from 'next-pwa';
import { isDev } from './app/utils/dev';

const withPWA = withPWAInit({
	dest: 'public',
	disable: isDev(),
	register: false,
	skipWaiting: true,
	customWorkerDir: 'worker',
	maximumFileSizeToCacheInBytes: 3000000 // 3mb
	// exclude: [
	// 	// add buildExcludes here
	// 	({ asset }) => {
	// 		if (
	// 			asset.name.startsWith('server/') ||
	// 			asset.name.match(/^((app-|^)build-manifest\.json|react-loadable-manifest\.json)$/)
	// 		) {
	// 			return true;
	// 		}
	// 		if (isDev() && !asset.name.startsWith('static/runtime/')) {
	// 			return true;
	// 		}
	// 		return false;
	// 	}
	// ]
});

const nextConfig: NextConfig = {
	devIndicators: false,
	reactStrictMode: false,
	sassOptions: {
		includePaths: ['styles'],
		prependData:
			'@use "@/public/styles/abstracts/_variables.scss" as *; @use "@/public/styles/abstracts/_functions.scss" as *; @use "@/public/styles/abstracts/_mixins.scss" as *;'
		// productionBrowserSourceMaps: true
	},
	images: {
		deviceSizes: [750, 1080, 1300, 1920],
		imageSizes: [48, 64, 128, 425],

		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'style-shop-bucket.s3.ap-northeast-2.amazonaws.com',
				port: '',
				pathname: '/**' // 모든 경로 허용
			}
		]
	},
	async redirects() {
		return [
			{
				source: '/', // 유저가 진입한 URL
				destination: '/home', // 유저가 이동할 URL
				permanent: true
			},
			{
				source: '/explorer',
				destination: '/explorer/menu',
				permanent: true
			}
		];
	}
};

export default withPWA(nextConfig) as NextConfig;
