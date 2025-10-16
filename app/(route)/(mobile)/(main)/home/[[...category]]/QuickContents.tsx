'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { getContents } from '@/app/services/contents';
import Image from 'next/image';
import { HTTPError } from '@/app/services/HTTPError';
import { Link } from '@/app/components/common/Link';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper';
import styles from './home.module.scss';
import 'swiper/css';
import { FreeMode, Controller } from 'swiper/modules';
import { useState } from 'react';

export default function QuickContents() {
	const { data: contents } = useSuspenseQuery({
		queryFn: () => getContents({ match: { name: '이벤트' } }),
		queryKey: ['이벤트'],
		select: data => {
			if (!data.success) throw new HTTPError(data.message);
			return data.data;
		}
	});

	const [firstSwiper, setFirstSwiper] = useState<SwiperClass | null>(null);
	const [secondSwiper, setSecondSwiper] = useState<SwiperClass | null>(null);

	const firstRowContents = contents.filter((_, index) => index % 2 === 0);
	const secondRowContents = contents.filter((_, index) => index % 2 === 1);

	return (
		<section className={`sectionLayoutSm ${styles.quickContents}`}>
			<header>
				<div className="inner">
					<h3 className="hidden">빠른 컨텐츠 이동</h3>
				</div>
			</header>

			<div className={styles.swiperContainer}>
				<Swiper
					className={`${styles.swiper} ${styles.firstRow}`}
					slidesPerView="auto"
					freeMode={{
						enabled: true,
						momentumRatio: 0.8
					}}
					spaceBetween={9}
					modules={[FreeMode, Controller]}
					onSwiper={setFirstSwiper}
					controller={{ control: secondSwiper }}>
					{firstRowContents.map(content => (
						<SwiperSlide key={content._id.toString()}>
							<Link href="#" className={styles.link}>
								<div className="icon">
									<Image
										src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${content.images[0]}`}
										width={22}
										height={22}
										alt={content.title}
										loading="eager"
									/>
								</div>
								{content.title}
							</Link>
						</SwiperSlide>
					))}
				</Swiper>

				<Swiper
					className={`${styles.swiper} ${styles.secondRow}`}
					slidesPerView="auto"
					freeMode={{
						enabled: true,
						momentumRatio: 0.8
					}}
					spaceBetween={9}
					modules={[FreeMode, Controller]}
					onSwiper={setSecondSwiper}
					controller={{ control: firstSwiper }}>
					{secondRowContents.map(content => (
						<SwiperSlide key={content._id.toString()}>
							<Link href="#" className={styles.link}>
								<div className="icon">
									<Image
										src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${content.images[0]}`}
										width={22}
										height={22}
										alt={content.title}
										loading="eager"
									/>
								</div>
								{content.title}
							</Link>
						</SwiperSlide>
					))}
				</Swiper>
			</div>
		</section>
	);
}
