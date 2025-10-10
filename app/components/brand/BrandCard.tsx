'use client';

import { BrandWithProduct } from '@/app/types';
import Image from 'next/image';
import Link from 'next/link';
import { WishButton } from '../wish';
import styles from './BrandCard.module.scss';
import { MySwiper } from '../common/Swiper';
import ProductCard from '../product/ProductCard';

interface BrandCardProps {
	data: BrandWithProduct;
}

export default function BrandCard({ data }: BrandCardProps) {
	return (
		<div className={styles.brandCard}>
			<header className={styles.header}>
				<Link href={data._id ? `/brand/${data._id}` : '#none'} className={styles.left}>
					<div className={styles.imageWrap}>
						{data.images[0] && (
							<Image
								src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${data.images[0]}`}
								alt={data.name.main}
								width={24}
								height={24}
							/>
						)}
					</div>
					<h5>{data.name.main}</h5>
				</Link>
				<WishButton name="brand" targetId={data._id} size="sm" label />
			</header>
			<div className={styles.contents}>
				<MySwiper slidesPerView={3} spaceBetween="0" inner slidesOffsetAfter>
					{data.products?.map(product => {
						return (
							<ProductCard
								product={product}
								key={product._id}
								imageSizes="20vw"
								shape="rect"
							/>
						);
					})}
				</MySwiper>
			</div>
		</div>
	);
}
