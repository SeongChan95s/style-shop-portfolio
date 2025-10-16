'use client';

import Image from 'next/image';
import { SwiperClass } from 'swiper/react';
import { Fragment, useRef, useState } from 'react';
import { MySwiper } from '@/app/components/common/Swiper';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getContents } from '@/app/services/contents';
import { CSSTransition } from 'react-transition-group';
import { Magazine } from '@/app/types';
import { createTransitionClassNames } from '@/app/utils/convert';
import styles from './home.module.scss';
export default function MainVisual() {
	const [activeVisual, setActiveVisual] = useState<number>(0);

	const handleSwiper = (swiper: SwiperClass) => {
		setActiveVisual(swiper.activeIndex);
	};

	const { data: response } = useSuspenseQuery({
		queryKey: ['visual'],
		queryFn: () => getContents<Magazine>({ match: { name: '쇼케이스' } })
	});

	const slideRef = useRef<HTMLLIElement[] | null[]>([]);

	return (
		<section className={styles.mainVisual}>
			<h3 className="hidden">비주얼</h3>
			<div className={styles.mainVisualBody}>
				<MySwiper
					className={styles.mainVisualSwiper}
					slidesPerView={1}
					variant="coverflow"
					onSlideChange={handleSwiper}>
					{response.success &&
						response.data?.map((visual, i) => (
							<Fragment key={i}>
								<Image
									src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${visual.images[0]}`}
									alt="임시"
									fill
									sizes="100%"
								/>
								<MySwiper.Container className={styles.container}>
									<h4 className={styles.title}>{visual.title}</h4>
									<p className={styles.body}>{visual.body}</p>
								</MySwiper.Container>
							</Fragment>
						))}
				</MySwiper>
			</div>

			<ul className={styles.visualBg}>
				{response.success &&
					response.data?.map((el, i) => {
						return (
							<Fragment key={i}>
								<CSSTransition
									in={i == activeVisual}
									nodeRef={{ current: slideRef.current[i] }}
									timeout={300}
									classNames={createTransitionClassNames('fade')}>
									<li
										ref={element => {
											slideRef.current[i] = element;
										}}>
										<Image
											src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${el.images[0]}`}
											alt="배경"
											fill
											sizes="100%"
										/>
									</li>
								</CSSTransition>
							</Fragment>
						);
					})}
			</ul>
		</section>
	);
}
