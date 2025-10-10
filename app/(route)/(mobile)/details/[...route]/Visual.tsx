'use client';

import Image from 'next/image';
import { ProductNested } from '@/app/types';
import styles from './details.module.scss';
import { blurDataUrl } from '@/app/constants/placeholder';

interface VisualProps {
	product: ProductNested;
}

export default function Visual({ product }: VisualProps) {
	return (
		<div className={styles.productVisual}>
			<Image
				src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${product.items[0].images?.[0]}`}
				fill={true}
				alt="대표 이미지"
				quality={80}
				placeholder="blur"
				blurDataURL={blurDataUrl}
			/>
		</div>
	);
}
