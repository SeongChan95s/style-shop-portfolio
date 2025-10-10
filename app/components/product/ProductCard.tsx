'use client';

import Image from 'next/image';
import { Card } from '../common/Card';
import { WishButton } from '../wish';
import { discountedPrice } from '@/app/utils/product';
import { Link } from '../common/Link';
import { ProductNested } from '@/app/types';
import styles from './ProductCard.module.scss';
import { useState } from 'react';
import { ColorPicker } from './ColorPicker';
import { translateCategory } from '@/app/utils/translate/translateCategory';

interface ProductCardProps {
	product: ProductNested;
	imageSizes?: string;
	direction?: 'vertical' | 'horizontal';
	ratio?: { width: number; height: number };
	size?: 'sm' | 'md';
	shape?: 'rect' | 'rounded';
	rest?: React.HTMLAttributes<HTMLAnchorElement>;
}

export default function ProductCard({
	product,
	imageSizes = '20vw',
	direction = 'vertical',
	ratio = { width: 1, height: 1 },
	size = 'md',
	shape = 'rounded',
	rest
}: ProductCardProps) {
	const [item, setItem] = useState(0);

	const colors = product.items.map(item => item.option.color);

	return (
		<Link
			href={`/details/${translateCategory(product.category.main)}/${product.items[item]._id}`}
			{...rest}
			transition="next"
			className={`${styles.card} ${styles[size]} ${styles[direction]} ${styles[shape]}`}>
			<Card direction={direction}>
				<Card.Thumbnail className={`${styles.thumbnail}`} ratio={ratio} shape={shape}>
					{direction == 'vertical' && (
						<WishButton
							targetId={product.items[0]._id}
							name="product"
							variant="thumb"
							size={size}
							className={styles.wishButton}
						/>
					)}

					<Image
						src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${product.items[item].images?.[0]}`}
						alt={product.name}
						fill={true}
						sizes={imageSizes}
						loading="eager"
					/>
				</Card.Thumbnail>

				<Card.Container className={styles.container}>
					<div className={styles.body}>
						<p className={styles.brand}>{product.brand}</p>
						<h4 className={styles.title}>
							{product.name}
							{product.items.length === 1 && (
								<>
									&nbsp;<span>({product.items[0].option.color})</span>
								</>
							)}
						</h4>
						<p className={styles.price}>
							{product.price.discount ? (
								<span className={styles.discount}>{product.price.discount}%</span>
							) : (
								''
							)}
							{discountedPrice(product.price.cost, product.price.discount)}원
						</p>

						<ColorPicker
							className={styles.colorPicker}
							size={size}
							colors={colors}
							category={product.category.main ?? Object.values(product.category)[0]}
							productItemsId={product.items.map(item => item._id)}
							onChange={value => setItem(value)}
						/>
					</div>

					{direction == 'horizontal' && (
						<WishButton
							targetId={product.items[0]._id}
							name="product"
							size={size}
							className={styles.wishButton}
						/>
					)}
				</Card.Container>
			</Card>
		</Link>
	);
}
