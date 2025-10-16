'use client';

import { IconArrowStick, IconHomeFilled, IconNotifyOutlined } from '../../common/Icon';
import { IconButton } from '../../common/IconButton';
import { useNavBar } from './NavBar.hooks';
import { Link } from '../../common/Link';
import { useViewTransition } from '@/app/hooks';
import { DarkModeButton } from '../../system';
import { CartButton } from '../../cart';
import { useMemo, useRef, useEffect, useState } from 'react';
import SearchNavBox from '../../explorer/SearchNavBox';
import styles from './NavBar.module.scss';
import HomeLnb from './HomeLnb';

export interface NavBarProps {
	display?: string;
}

const initialNavBarProps = {
	title: undefined,
	back: false,
	logo: false,
	home: false,
	search: false,
	darkMode: false,
	notify: false,
	cart: false,
	lnb: false,
	action: undefined
};

export default function NavBar({ display = '' }: NavBarProps) {
	const { matchedPath, scrollFlag, productName, isDetailsPage } = useNavBar();
	const colorClass = matchedPath?.color ? styles[matchedPath?.color] : styles.light;
	const titleRef = useRef<HTMLHeadingElement>(null);
	const [titleIsOverflowing, setTitleIsOverflowing] = useState(false);

	const props = useMemo(() => {
		return matchedPath?.props ?? initialNavBarProps;
	}, [matchedPath?.path ?? '']);

	const {
		title: titleProps,
		back,
		logo,
		home,
		search,
		darkMode,
		notify,
		cart,
		lnb,
		action
	} = props;

	// details 페이지에서는 상품명을 사용, 다른 페이지에서는 기존 로직 유지
	const title = useMemo(() => {
		if (isDetailsPage && productName) {
			return productName;
		}
		return (
			matchedPath && (typeof titleProps == 'function' ? titleProps(display) : titleProps)
		);
	}, [isDetailsPage, productName, matchedPath, titleProps, display]);

	const scrollFlagClass = matchedPath?.scroll?.type
		? `${styles?.[scrollFlag]} ${styles?.[matchedPath?.scroll?.type]}`
		: '';

	const { handleViewTransition } = useViewTransition();

	useEffect(() => {
		if (titleRef.current && title) {
			const element = titleRef.current;
			const isOverflow = element.scrollWidth > element.clientWidth;
			setTitleIsOverflowing(isOverflow);
		}
	}, [title]);

	const handleBackButton = () => {
		handleViewTransition('back', 'prev');
	};

	const handleClickTitle = () => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth'
		});
	};
	return (
		<header id="navBar" className={`${styles.navBar} ${colorClass} ${scrollFlagClass}`}>
			<div className={styles.container}>
				<nav className={styles.gnb}>
					<div className={styles.navLeft}>
						{back && (
							<IconButton
								className={styles.backButton}
								onClick={handleBackButton}
								size="lg">
								<IconArrowStick />
							</IconButton>
						)}

						{action && action}

						{title && (
							<div
								className={`${styles.titleBox} ${titleIsOverflowing ? styles.marquee : ''}`}>
								<h2 ref={titleRef} onClick={handleClickTitle}>
									{title}
								</h2>
							</div>
						)}
						{search && <SearchNavBox enabled={matchedPath?.path == '/explorer'} />}

						{!title && logo && (
							<h1 className={styles.logo}>
								<Link href="/">Style</Link>
							</h1>
						)}
					</div>

					<div className={styles.quickMenu}>
						<div className={styles.quickMenuContainer}>
							{darkMode && <DarkModeButton />}

							{home && (
								<Link href="/home">
									<IconHomeFilled />
								</Link>
							)}

							{notify && (
								<Link href="/" className={styles.button}>
									<IconButton size="lg" feedback>
										<IconNotifyOutlined className={styles.buttonNotify} />
									</IconButton>
								</Link>
							)}

							{cart && <CartButton className={styles.button} />}
						</div>
					</div>
				</nav>
				{lnb && <HomeLnb />}
			</div>
		</header>
	);
}
