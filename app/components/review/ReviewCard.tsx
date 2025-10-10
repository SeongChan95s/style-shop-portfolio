'use client';

import Image from 'next/image';
import { Review } from '@/app/types';
import { useState } from 'react';
import { Collapse } from '@/app/components/common/Collapse';
import { Card } from '../common/Card';
import { MySwiper } from '../common/Swiper';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserByEmail } from '@/app/services/user/getUserByEmail';
import { Menu } from '../common/Menu';
import { IconMoreVertical, IconTalkOutlined } from '../common/Icon';
import { deleteReview } from '@/app/services/review';
import { useSystemAlertStore } from '@/app/store';
import { useRouter } from 'next/navigation';
import { Link } from '../common/Link';
import ScoreRating from './ScoreRating';
import styles from './ReviewCard.module.scss';
import ReviewMenu from './ReviewMenu';

export default function ReviewCard({
	review,
	isAuthor,
	wrap,
	onClick
}: {
	review: Review<string>;
	wrap?: boolean;
	isAuthor: boolean;
	onClick?: React.MouseEventHandler<HTMLLIElement>;
}) {
	const [imageSizes, setImageSizes] = useState<string>('20vw');
	const [isVisible, setIsVisible] = useState(true);

	const handleImageResize = () => {
		if (wrap) {
			setImageSizes('20vw');
		} else {
			setImageSizes('100vw');
		}
	};

	const { data: user } = useQuery({
		queryFn: () => getUserByEmail(review.author.email),
		queryKey: ['user', review.author.email]
	});

	if (!review?.productItem) return <></>;

	if (isVisible)
		return (
			<Card
				className={`${styles.card} ${wrap ? styles.wrap : ''}`}
				as="li"
				onClick={onClick}>
				<div className={styles.header}>
					<div className={styles.profileImg}>
						{review.author.name.charAt(0).toUpperCase()}
					</div>

					<div className={styles.profile}>
						<p className={styles.userId}>{review.author.name}</p>

						<div className={styles.info}>
							<ul className={styles.body}>
								{user?.gender && <li>{user?.gender}</li>}
								{user?.height && (
									<li>
										<span>{user?.height}</span>(cm)
									</li>
								)}
								{user?.weight && (
									<li>
										<span>{user?.weight}</span>(kg)
									</li>
								)}
							</ul>
							<ul className={styles.option}>
								{Object.values(review.productItem.option).map((value, i) => (
									<li key={i}>{value}</li>
								))}
							</ul>
						</div>
					</div>

					<ReviewMenu
						className={styles.reviewMenu}
						productItemId={review.productItem._id}
						orderId={review.orderId.toString()}
						size="sm"
						reviewId={review._id.toString()}
						setIsVisible={setIsVisible}
					/>
				</div>

				<Card.Container className={styles.container}>
					{review.content.images.length >= 1 && (
						<MySwiper className={styles.thumbSwiper} inner>
							{review.content.images.map((el, i) => {
								return (
									<Card.Thumbnail
										className={styles.thumbnail}
										ratio={{ width: 16, height: 19 }}
										key={i}>
										<Image
											src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${review.content.images[i]}`}
											alt="리뷰"
											quality={80}
											fill
											sizes={imageSizes}
										/>
									</Card.Thumbnail>
								);
							})}
						</MySwiper>
					)}

					<ScoreRating
						className={styles.scoreRating}
						value={review.score}
						size="sm"
						readOnly
					/>

					<Collapse line={2} wrap={wrap} className={styles.textContainer}>
						<p>{review.content.text}</p>
					</Collapse>
				</Card.Container>

				<div className={styles.footer}>
					<Link
						href={`/review/details/${review._id.toString()}`}
						className={styles.commentButton}
						transition="next">
						<IconTalkOutlined size="sm" />
						<span className={styles.label}>{review.comment}</span>
					</Link>
				</div>
			</Card>
		);
}
