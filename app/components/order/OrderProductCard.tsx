'use client';

import Image from 'next/image';
import { Card } from '../common/Card';
import { ProductItem } from '@/app/types';
import { Button } from '../common/Button';
import styles from './OrderProductCard.module.scss';

interface OrderProductCardProps {
	product: {
		count: number;
		items: ProductItem[];
		totalView?: number;
		_id: string;
		name: string;
		brand: string;
		price: {
			cost: number;
			discount: number;
		};
		category: {
			[key: string]: string;
		};
		keywords: string[];
	};
	onClickOptionButton?: () => void;
}

export default function OrderProductCard({
	product,
	onClickOptionButton
}: OrderProductCardProps) {
	const discountedPrice = (~~(
		product.price.cost -
		(product.price.cost * product.price.discount) / 100
	)).toLocaleString();

	return (
		<Card className={styles.card} direction="horizontal" as="li">
			<Card.Thumbnail className={styles.thumbnail} ratio={{ width: 1, height: 1.25 }}>
				<Image
					src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${product.items[0].images?.[0]}`}
					alt={product.name}
					sizes="20vw"
					fill
				/>
			</Card.Thumbnail>
			<Card.Container className={styles.container}>
				<p className={styles.brand}>{product.brand}</p>
				<h5 className={styles.name}>{product.name}</h5>
				<p className={styles.stats}>
					{product.items[0].option.color} / {product.items[0].option.size} /{' '}
					{product.count}개
				</p>
				<p className={styles.cost}>{product.price.cost.toLocaleString()}</p>
				<p className={styles.discountedPrice}>{discountedPrice}원</p>
			</Card.Container>

			<div className={styles.footer}>
				<Button variant="outlined" size="sm" fill onClick={onClickOptionButton}>
					옵션 변경
				</Button>
			</div>
		</Card>
	);
}
