'use client';

import { discountedPrice } from '@/app/utils/product';
import { Breadcrumb } from '@/app/components/common/Breadcrumb';
import { IconStarFilled } from '@/app/components/common/Icon';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Divider } from '@/app/components/common/Divider';
import { ProductNested } from '@/app/types';
import { ColorPicker } from '@/app/components/product';
import { getScoreByProductGroupId } from '@/app/services/score/getScoreByProductGroupId';
import styles from './details.module.scss';

interface OverviewProps {
	product: ProductNested;
	category: string;
}
export default function Overview({ product, category }: OverviewProps) {
	const breadcrumbLinks = [
		{
			name: product.category.main,
			href: `/explorer/result/product?search=${product.category.main}`
		},
		{
			name: product.category.gender as string,
			href: `/explorer/result/product?search=${product.category.gender}`
		},
		{
			name: product.category.part,
			href: `/explorer/result/product?search=${product.category.part}`
		},
		{
			name: product.category.type,
			href: `/explorer/result/product?search=${product.category.type}`
		}
	];

	const { data: score, isSuccess } = useSuspenseQuery({
		queryFn: async () => await getScoreByProductGroupId(product._id),
		queryKey: ['review', 'score', product._id]
	});

	const productItemsId = product.items.map(item => item._id);
	const colors = product.items.map(item => item.option.color);

	const handleScrollToReview = () => {
		const target = document.getElementsByClassName('reviewSection')[0];

		target.scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		});
	};

	return (
		<section className={`${styles.overview}`}>
			<div className="inner">
				<h3 className="hidden">상품 요약 섹션</h3>
				<article className={styles.content}>
					<Breadcrumb links={breadcrumbLinks} className={styles.breadcrumb} />

					<h4 className={styles.name}>
						{product.name} ({product.items[0].option.color})
					</h4>
					<div className={styles.values}>
						<div className={styles.score}>
							<IconStarFilled size="sm" />
							<span className={styles.label}>{isSuccess && score.score}</span>
							<span className={styles.reviewCount} onClick={handleScrollToReview}>
								후기 {score.count}개
							</span>
						</div>
					</div>

					<div className={styles.price}>
						<p className={styles.cost}>{product.price.cost.toLocaleString()}원</p>
						<p className={styles.payment}>
							<span className={styles.discount}>{product.price.discount}%</span>
							<span className={styles.discountedPrice}>
								{discountedPrice(product.price.cost, product.price.discount)}원
							</span>
						</p>
					</div>

					<ColorPicker
						className={styles.colorPicker}
						colors={colors}
						size="lg"
						category={category}
						productItemsId={productItemsId}
					/>
				</article>

				<Divider />

				<article className={styles.info}>
					<dl>
						<dt>구매 적립금</dt>
						<dd>최대 801 마일리지 적립 예정</dd>
					</dl>
					<dl>
						<dt>무이자 할부</dt>
						<div>
							<dd>최대 7개월 무이자 할부 시 월 11,442원 결제</dd>
							<dd>카드사별 할부 혜택 안내</dd>
						</div>
					</dl>
					<dl>
						<dt>배송정보</dt>
						<dd>예약 출고 2025.02.24 이내 출고</dd>
					</dl>
					<dl>
						<dt>배송비</dt>
						<div>
							<dd>무료배송</dd>
							<dd>제주/도서산간 3,000원 추가</dd>
						</div>
					</dl>
				</article>
			</div>
		</section>
	);
}
