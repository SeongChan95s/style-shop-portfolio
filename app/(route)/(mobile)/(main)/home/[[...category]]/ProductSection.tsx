import { MySwiper } from '@/app/components/common/Swiper';
import { ProductCard } from '@/app/components/product';
import { Skeleton } from '@/app/components/common/Skeleton';
import { ProductNested } from '@/app/types';

interface ProductSectionProps {
	title: string;
	products: ProductNested[];
}

function ProductSection({ title, products }: ProductSectionProps) {
	return (
		<section className="sectionLayoutMd">
			<header className="headerLayoutMd">
				<div className="inner">
					<h3>{title}</h3>
				</div>
			</header>
			<MySwiper variant="card" slidesPerView={3} inner>
				{products.map(product => (
					<ProductCard product={product} key={product._id.toString()} imageSizes="20vw" />
				))}
			</MySwiper>
		</section>
	);
}

ProductSection.Skeleton = function ProductSectionSkeleton() {
	return (
		<section className="sectionLayoutMd">
			<header className="headerLayoutMd">
				<div className="inner">
					<Skeleton fontSize="2.4rem" width="16rem" />
				</div>
			</header>
			<div className="inner">
				<div className="column3">
					{Array.from({ length: 3 }).map((_, i) => (
						<ProductCard.Skeleton key={i} className="columnItem" />
					))}
				</div>
			</div>
		</section>
	);
};

export default ProductSection;
