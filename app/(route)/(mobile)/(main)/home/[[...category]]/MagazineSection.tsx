import { MySwiper } from '@/app/components/common/Swiper';
import { ProductCard } from '@/app/components/product';
import { Skeleton } from '@/app/components/common/Skeleton';
import { Card } from '@/app/components/common/Card';
import { Magazine } from '@/app/types';
import Image from 'next/image';
import styles from './home.module.scss';

interface MagazineSectionProps {
	title: string;
	magazines: Magazine[];
}

function MagazineSection({ title, magazines }: MagazineSectionProps) {
	return (
		<section className={`sectionLayoutMd ${styles.magazineStand}`}>
			<header className="headerLayoutMd">
				<div className="inner">
					<h3 className="headerMbSm">{title}</h3>
				</div>
			</header>

			<MySwiper variant="cardPerView" slidesPerView={1} inner>
				{magazines.map((magazine, i) => (
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

MagazineSection.Skeleton = function MagazineSectionSkeleton() {
	return (
		<div className={`${styles.magazineStand} sectionLayoutMd`}>
			<div className="inner">
				<Skeleton className="headerLayoutMd" variant="text" fontSize="2rem" />
				<div className={styles.visual}>
					<Skeleton fill />
				</div>
				<div className={styles.productWrap}>
					<ProductCard.Skeleton direction="horizontal" />
					<ProductCard.Skeleton direction="horizontal" />
				</div>
			</div>
		</div>
	);
};

export default MagazineSection;
