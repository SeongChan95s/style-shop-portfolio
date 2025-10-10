'use client';

import { getContentsWithProducts } from '@/app/services/contents';
import { Magazine } from '@/app/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { MySwiper } from '@/app/components/common/Swiper';
import { ProductCard } from '@/app/components/product';
import { Card } from '@/app/components/common/Card';
import { merge } from 'lodash';
import styles from './home.module.scss';

interface MagazineStandProps {
	query?: object;
}

export default function MagazineStand({ query }: MagazineStandProps) {
	const { data: result } = useSuspenseQuery({
		queryFn: () =>
			getContentsWithProducts<Magazine>(
				merge({ match: { name: '매거진' } }, { ...query })
			),
		queryKey: ['magazine', query]
	});

	const magazines = result.success ? result.data : [];

	return (
		<section className={`sectionLayoutMd ${styles.magazineStand}`}>
			<header className="headerLayoutMd">
				<div className="inner">
					<h3 className="headerMbSm">매거진</h3>
				</div>
			</header>

			<MySwiper variant="cardPerView" slidesPerView={1} inner>
				{result.success &&
					magazines.map((magazine, i) => (
						<article className={styles.magazine} key={i}>
							<Card className={styles.visual}>
								<Card.Thumbnail>
									<Image
										src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${magazine.images[0]}`}
										alt={magazine.title}
										sizes="100%"
										fill
										loading="eager"
									/>
								</Card.Thumbnail>
								<Card.Container variant="float">
									<h4 className={styles.title}>{magazine.title}</h4>
									<p>{magazine.body}</p>
								</Card.Container>
							</Card>

							<div className={styles.productList}>
								{magazine.products.map(product => (
									<ProductCard
										product={product}
										size="md"
										direction="horizontal"
										key={product._id}
									/>
								))}
							</div>
						</article>
					))}
			</MySwiper>
		</section>
	);
}
