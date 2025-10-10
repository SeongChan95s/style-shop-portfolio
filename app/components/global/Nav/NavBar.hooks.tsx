import { usePathname, useParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProductNestedByItemId } from '@/app/services/product';

interface NavBarProps {
	title?: string | ((name: string) => string);
	subText?: string;
	back?: boolean;
	logo?: boolean;
	home?: boolean;
	search?: boolean;
	darkMode?: boolean;
	notify?: boolean;
	cart?: boolean;
	lnb?: boolean;
	action?: React.ReactNode;
}

interface pathMap {
	path: string;
	exact?: boolean;
	color?: 'light' | 'dark' | 'glass' | 'transparent';
	scroll?: {
		type?: 'transform' | 'reverse';
		maxScroll?: number;
	};
	props?: NavBarProps;
}

function useNavPath() {
	const pathname = usePathname();
	const pathMap: pathMap[] = useMemo(
		() => [
			{
				path: '/home',
				color: 'glass',
				scroll: { type: 'transform', maxScroll: 90 },
				props: { logo: true, darkMode: true, notify: true, cart: true, lnb: true }
			},
			{ path: '/about', props: { title: '회사 소개' } },
			{ path: '/explorer', props: { search: true, cart: true, back: true } },
			{ path: '/feed', props: { title: '피드', notify: true } },
			{ path: '/wish', props: { title: '좋아요', cart: true } },
			{
				path: '/brand',
				props: { title: '브랜드', search: true, cart: true, back: true }
			},
			{
				path: '/my',
				color: 'dark',
				scroll: { type: 'reverse', maxScroll: 200 },
				props: { title: '마이', notify: true, cart: true, search: true }
			},
			{
				path: '/cart',
				props: { title: '장바구니', home: true, back: true, notify: true }
			},
			{
				path: '/admin',
				props: {
					title: '관리자',
					notify: true,
					home: true
				}
			},
			{
				path: '/details',
				props: { title: name => `${name}`, back: true, notify: true, cart: true }
			},
			{
				path: '/review/details',
				props: { title: '상세 후기', back: true, home: true }
			},
			{
				path: '/review/edit',
				props: { title: '후기 작성', back: true, home: true }
			},
			{
				path: '/auth/login',
				props: { title: '로그인', back: true, home: true }
			},
			{
				path: '/auth/register',
				props: { title: '회원가입', back: true, home: true }
			},
			{
				path: '/auth/find/id',
				props: { title: '아이디 찾기', back: true, home: true }
			},
			{
				path: '/auth/find/password',
				props: { title: '패스워드 찾기', back: true, home: true }
			},
			{
				path: '/user/personalInfo',
				props: { title: '회원 정보', back: true, home: true }
			},
			{
				path: '/user/style',
				props: { title: '맞춤 스타일', back: true, home: true }
			},
			{
				path: '/user/order',
				props: { title: '주문 배송', back: true, cart: true, home: true }
			},
			{
				path: '/user/address',
				props: { title: '배송지 정보', back: true, home: true },
				exact: true
			},
			{
				path: '/user/address/edit',
				props: { title: '배송지 추가', back: true, home: true }
			},
			{
				path: '/order/process',
				props: { title: '주문서', back: true, home: true }
			},
			{
				path: '/order/detail',
				props: { title: '주문 상세', back: true, home: true }
			}
		],
		[]
	);

	const matchedPath = pathMap.find(({ path, exact = false }) =>
		exact ? pathname === path : pathname.startsWith(path)
	);

	return matchedPath;
}

type Flag = 'top' | 'up' | 'down' | 'bottom';

export default function useNavBarScroll(maxScroll: number | undefined = 75) {
	const pathname = usePathname();
	const [scrollFlag, setScrollFlag] = useState<Flag>('top');
	const beforeScrollY = useRef(0);

	const updateScrollFlag = () => {
		const { scrollY } = window;
		// iOS elastic scrolling issue
		const screenHeight = window.innerHeight;
		const bodyHeight = document.body.scrollHeight;

		// 최상단
		if (scrollY < maxScroll) {
			setScrollFlag('top');
		} else if (scrollY == bodyHeight - screenHeight) {
			setScrollFlag('bottom');
		} else if (beforeScrollY.current > scrollY) {
			setScrollFlag('up');
		} else {
			setScrollFlag('down');
		}

		beforeScrollY.current = scrollY;

		if (maxScroll) {
			const navElement = document.getElementById('navBar');
			if (navElement) {
				const scrollProgress =
					Math.trunc(Math.min(1, (scrollY / maxScroll) * 1) * 100) / 100;
				navElement.style.setProperty('--scroll-progress', scrollProgress.toString());
			}
		}
	};

	useEffect(() => {
		updateScrollFlag();
		window.addEventListener('scroll', updateScrollFlag);
		return () => {
			window.removeEventListener('scroll', updateScrollFlag);
		};
	}, [pathname]);

	return scrollFlag;
}

export function useNavBar() {
	const matchedPath = useNavPath();
	const scrollFlag = useNavBarScroll(matchedPath?.scroll?.maxScroll ?? undefined);
	const pathname = usePathname();
	const params = useParams();

	// details 페이지인지 확인
	const isDetailsPage = pathname.startsWith('/details');
	const itemId =
		isDetailsPage && params.route
			? Array.isArray(params.route)
				? params.route[params.route.length - 1]
				: params.route
			: null;

	// details 페이지에서만 상품 정보 조회
	const { data: productData } = useQuery({
		queryKey: ['product', itemId],
		queryFn: () => getProductNestedByItemId(itemId as string),
		enabled: isDetailsPage && !!itemId
	});

	const productName =
		productData && productData.success ? productData.data?.name : undefined;

	return {
		matchedPath,
		scrollFlag,
		productName,
		isDetailsPage
	};
}
