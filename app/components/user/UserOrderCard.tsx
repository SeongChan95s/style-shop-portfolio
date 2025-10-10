'use client';

import Image from 'next/image';
import { Card } from '../common/Card';
import { OrderProducts } from '@/app/types';
import { Button } from '../common/Button';
import { classNames } from '@/app/utils';
import { usePathname, useRouter } from 'next/navigation';
import styles from './UserOrderCard.module.scss';
import { Link } from '../common/Link';
import { translateCategory } from '@/app/utils/translate/translateCategory';

interface UserOrderCardProps {
	className?: string;
	orderProducts: OrderProducts<string>;
}

export default function UserOrderCard({
	className: classNameProp,
	orderProducts
}: UserOrderCardProps) {
	const className = classNames(styles.card, classNameProp);
	const router = useRouter();
	const pathname = usePathname();

	return (
		<Card className={className} direction="vertical" as="div">
			<ul className={styles.products}>
				{orderProducts.products.map(product => (
					<li className={styles.product} key={`${product._id}`}>
						<Link
							href={`/details/${translateCategory(product.category.main)}/${product.items[0]._id}`}
							className={styles.body}>
							<Card.Thumbnail
								className={styles.thumbnail}
								ratio={{ width: 1, height: 1.1 }}>
								<Image
									src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${product.items?.[0].images?.[0]}`}
									alt={product.name}
									sizes="20vw"
									fill
								/>
							</Card.Thumbnail>

							<div className={styles.description}>
								<p className={styles.brand}>{product.brand}</p>
								<h5 className={styles.name}>{product.name}</h5>
								<p className={styles.option}>
									{Object.values(product.items[0].option).join(' / ')} / {product.count}
								</p>
							</div>
						</Link>

						<div className={styles.footer}>
							{(() => {
								const item = product.items[0];

								return (
									<Button
										onClick={() =>
											router.push(
												item.hasReview
													? `/review/details/${item.reviewId}`
													: `/review/edit/new?orderId=${orderProducts._id}&itemId=${item._id}&callbackUrl=${encodeURIComponent(pathname)}`
											)
										}
										size="xs"
										variant="outlined"
										fill>
										{item.hasReview ? '리뷰 보기' : '후기 작성'}
									</Button>
								);
							})()}
							<Button size="xs" variant="outlined" fill>
								재구매
							</Button>
						</div>
					</li>
				))}
			</ul>
		</Card>
	);
}
