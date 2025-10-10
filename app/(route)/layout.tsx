import { cookies } from 'next/headers';
import { ReactQueryProvider, SessionProvider } from '../providers';
import '@/public/styles/base/_reset.scss';
import '@/public/styles/base/_css_variables.scss';
import '@/public/styles/base/_typography.scss';
import '@/public/styles/base/_layout.scss';
import '@/public/styles/utils/_transition.scss';
import Head from './Head';
import { NavBar } from '../components/global/Nav';
import { PushNotificationManager, SystemAlert } from '../components/system';
import GlobalContainer from './GlobalContainer';

export const metadata = {
	title: 'STYLE',
	description: '설명',
	keywords: ['옷', '의류', '패션', '소품', '스타일'],
	authors: [{ name: 'SeongChan', url: 'https://github.com/SeongChan95s' }],
	icons: { icon: '/settings/favicon.png' },
	robots: {
		index: false,
		follow: false
	},
	openGraph: {
		title: 'STYLE',
		description: '감성 있는 취향 셀렉트샵',
		url: 'https://style-shop-portfolio.vercel.app',
		siteName: 'STYLE NAME',
		images: [
			{
				url: 'https://style-shop-bucket.s3.ap-northeast-2.amazonaws.com/temp01.png',
				alt: '공유이미지'
			}
		],
		type: 'website'
	}
};

export const viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	viewportFit: 'cover'
};

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	const darkMode = async () => {
		const cookie = (await cookies()).get('mode');
		return cookie != undefined && cookie.value == 'dark' ? 'darkMode' : '';
	};
	const darkModeClass = await darkMode();

	return (
		<html lang="ko">
			<Head />
			<body className={`${darkModeClass}`}>
				<ReactQueryProvider>
					<SessionProvider>
						<GlobalContainer>
							<NavBar />
							{children}
							<SystemAlert />
							<PushNotificationManager />
						</GlobalContainer>
					</SessionProvider>
				</ReactQueryProvider>
			</body>
		</html>
	);
}
