'use client';

import {
	IconFeedFilled,
	IconFeedOutlined,
	IconHeartFilled,
	IconHeartOutlined,
	IconHomeFilled,
	IconHomeOutlined,
	IconPersonFilled,
	IconPersonOutlined,
	IconSearchFilled,
	IconSearchOutlined
} from '@/app/components/common/Icon';

import { usePathname } from 'next/navigation';
import AppBar from '../../common/AppBar/AppBar';
import { useState } from 'react';
import { IconButton } from '../../common/IconButton';
import { Link } from '../../common/Link';
import styles from './TabBar.module.scss';

export default function TabBar() {
	const [isClicked, setIsClicked] = useState([false, false, false, false, false]);

	const pathname = usePathname();
	const TabBarProps = [
		{
			label: 'explorer',
			href: '/explorer',
			icons: {
				normal: <IconSearchOutlined size="fill" />,
				activated: <IconSearchFilled size="fill" />
			}
		},
		{
			label: 'feed',
			href: '/feed',
			icons: {
				normal: <IconFeedOutlined size="fill" />,
				activated: <IconFeedFilled size="fill" />
			}
		},
		{
			label: 'home',
			href: '/home',
			end: true,
			icons: {
				normal: <IconHomeOutlined size="fill" />,
				activated: <IconHomeFilled size="fill" />
			}
		},
		{
			label: 'like',
			href: '/wish',
			icons: {
				normal: <IconHeartOutlined size="fill" />,
				activated: <IconHeartFilled size="fill" />
			}
		},
		{
			label: 'my',
			href: '/my',
			icons: {
				normal: <IconPersonOutlined size="fill" />,
				activated: <IconPersonFilled size="fill" />
			}
		}
	];

	return (
		<AppBar id={styles.tabBar}>
			<nav>
				<ul>
					{TabBarProps.map((prop, i) => (
						<li key={i}>
							<Link
								className={styles.link}
								href={prop.href}
								onClick={() =>
									setIsClicked(prev => [
										...prev.slice(0, i),
										!prev[i],
										...prev.slice(i + 1)
									])
								}>
								<IconButton
									className={styles.iconButton}
									feedback
									isClicked={isClicked[i]}>
									{pathname.includes(prop.href)
										? prop.icons.activated
										: prop.icons.normal}
								</IconButton>
								<span className={styles.label}>{prop.label.toUpperCase()}</span>
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</AppBar>
	);
}
