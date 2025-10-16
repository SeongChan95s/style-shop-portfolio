'use client';

import { MySwiper } from '@/app/components/common/Swiper';
import Image from 'next/image';
import { Review } from '@/app/types';
import styles from './page.module.scss';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getProductNestedByItemId } from '@/app/services/product';
import ProductCard from '@/app/components/product/ProductCard';
import { IconButton } from '@/app/components/common/IconButton';
import {
	IconShare
} from '@/app/components/common/Icon';
import { WishButton } from '@/app/components/wish';
import ReviewMenu from '@/app/components/review/ReviewMenu';

interface ReviewContentProps {
	review: Review<string>;
}

export default function ReviewContent({ review }: ReviewContentProps) {
	const { data } = useSuspenseQuery({
		queryFn: () => getProductNestedByItemId(review.productItemId),
		queryKey: ['product', review.productItemId]
	});

	const handleShare = () => {
		if (navigator.share) {
			navigator.share({
				title: `${product.name}의 후기`,
				text: review.content.text,
				url: window.location.href
			});
		}
	};

	if (!data.success) return <></>;
	const product = data.data;

	return (
		<section className={styles.reviewContent}>
			{review.content.images.length >= 1 && (
				<div className={styles.visual}>
					{
						<div className={styles.thumbWrap}>
							<MySwiper className={styles.thumbSwiper} spaceBetween={0} slidesPerView={1}>
								{review.content.images.map((el, i) => {
									if (el != '')
										return (
											<Image
												src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${review.content.images[i]}`}
												alt="리뷰"
												quality={80}
												fill
												sizes="100vw"
												key={review._id.toString()}
											/>
										);
								})}
							</MySwiper>
						</div>
					}
				</div>
			)}

			<div className={styles.product}>
				<ProductCard direction="horizontal" product={product} size="sm" />
			</div>

			<div className={`inner ${styles.container}`}>
				<div className={styles.actions}>
					<WishButton targetId={review._id} name="review" label />
					<IconButton size="md" onClick={handleShare}>
						<IconShare />
					</IconButton>

					<ReviewMenu
						className={styles.settingButton}
						productItemId={review.productItemId}
						orderId={review.orderId}
						reviewId={review._id}
					/>
				</div>
				<div className={styles.contents}>
					<p className={styles.name}>{review.author.name}</p>
					<p className={styles.text}>{review.content.text}</p>
				</div>
			</div>
		</section>
	);
}
