'use client';

import Chip from '../../common/Chip/Chip';
import { usePathname, useRouter } from 'next/navigation';
import styles from './NavBar.module.scss';
import { useSystemAlertStore } from '@/app/store';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';

export default function HomeLnb() {
	const pathname = usePathname();
	const router = useRouter();

	const pathProps = [
		{
			href: '/home',
			label: '홈'
		},
		{
			href: '/home/woman',
			label: '여성'
		},
		{
			href: '/home/man',
			label: '남성'
		},
		{
			label: '패션위크'
		},
		{
			label: '세일'
		},
		{
			label: '신상'
		}
	];

	const handleLink = (link?: string) => () => {
		if (link) {
			router.push(link);
		} else {
			useSystemAlertStore.getState().push('준비되지 않은 페이지 입니다.');
		}
	};

	return (
		<nav id={styles.homeLnb}>
			<Swiper
				className={styles.swiper}
				slidesPerView="auto"
				spaceBetween={7}
				freeMode={{
					enabled: true,
					momentumRatio: 0.8
				}}
				modules={[FreeMode]}>
				{pathProps.map((prop, i) => (
					<SwiperSlide key={`homeLnbLink${i}`}>
						<Chip
							className={`${styles.chip} ${pathname == prop.href ? styles.active : ''}`}
							variant="outlined"
							size="md"
							onClick={handleLink(prop.href)}>
							{prop.label}
						</Chip>
					</SwiperSlide>
				))}
			</Swiper>
		</nav>
	);
}
