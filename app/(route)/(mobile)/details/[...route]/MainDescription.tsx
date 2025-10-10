'use client';

import { ProductNested } from '@/app/types';
import Image from 'next/image';
import styles from './details.module.scss';
import { useState } from 'react';
import { Button } from '@/app/components/common/Button';
import { IconArrowTrim } from '@/app/components/common/Icon';
import { blurDataUrl } from '@/app/constants/placeholder';

interface MainDescriptionProps {
	product: ProductNested;
}

export default function MainDescription({ product }: MainDescriptionProps) {
	const [collapse, setCollapse] = useState(false);

	const images = product.items[0].images;

	return (
		<section className={`${styles.mainDescription} sectionLayoutLg`}>
			<div className="inner">
				<header className="headerLayoutLg">
					<h3>상품 정보</h3>
				</header>

				<div className={styles.contents}>
					<div className={styles.main}>
						{images && (
							<Image
								src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${images[1]}`}
								alt="대표 이미지"
								sizes="100vw"
								width={0}
								height={0}
								placeholder="blur"
								blurDataURL={blurDataUrl}
							/>
						)}

						{images && images.length > 2 && !collapse && (
							<Button
								className={styles.moreButton}
								variant="outlined"
								fill
								onClick={() => setCollapse(true)}>
								상품 정보 더보기 <IconArrowTrim />
							</Button>
						)}
					</div>

					{collapse && (
						<div className={styles.sub}>
							{images?.slice(2).map((image, i) => (
								<Image
									src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${image}`}
									alt="대표 이미지"
									sizes="100vw"
									width={0}
									height={0}
									key={`sub_${image}_${i}`}
									placeholder="blur"
									blurDataURL={blurDataUrl}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
