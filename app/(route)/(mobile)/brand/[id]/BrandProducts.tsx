'use client';

import { ProductCard } from '@/app/components/product';
import SearchList from '@/app/components/explorer/SearchProductList';
import styles from './brand.module.scss';

export function BrandProductsSkeleton() {
	return (
		<section className={`${styles.brandProducts} sectionLayoutMd`}>
			<header className="headerLayoutMd">
				<div className="inner">
					<h3>브랜드 상품</h3>
				</div>
			</header>
			<div className={styles.productWrap}>
				{Array.from({ length: 4 }, (_, i) => (
					<ProductCard.Skeleton key={i} className="columnItem" />
				))}
			</div>
		</section>
	);
}

interface BrandProductsProps {
	brandName: string;
}

export default function BrandProducts({ brandName }: BrandProductsProps) {
	return (
		<section className={`${styles.brandProducts} sectionLayoutMd`}>
			<header className="headerLayoutMd">
				<div className="inner">
					<h3>상품 목록</h3>
				</div>
			</header>
			<div className={styles.productWrap}>
				<SearchList match={{ group: { brand: brandName } }} />
			</div>
		</section>
	);
}
