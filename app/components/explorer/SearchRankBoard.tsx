'use client';

import { useState } from 'react';
import { Accordion } from '../common/Accordion';
import { ProductNested, Search } from '@/app/types';
import { Link } from '../common/Link';
import { IconDecrease, IconTriangleFilled } from '../common/Icon';
import styles from './SearchRankBoard.module.scss';
import { MySwiper } from '../common/Swiper';
import ProductCard from '../product/ProductCard';
import { Divider } from '../common/Divider';
import { Skeleton } from '../common/Skeleton';

export function SearchRankBoardSkeleton() {
	return (
		<>
			<Skeleton fontSize="36px" />
			<Skeleton fontSize="36px" />
			<Skeleton fontSize="36px" />
			<Skeleton fontSize="36px" />
			<Skeleton fontSize="36px" />
		</>
	);
}

interface SearchRankBoardProps {
	data: (Search & { state: 'up' | 'none' | 'down' | 'new'; products: ProductNested[] })[];
}

const stateIcon = {
	up: <IconTriangleFilled className={styles.up} />,
	down: <IconTriangleFilled className={styles.down} />,
	none: <IconDecrease className={styles.none} />,
	new: <span className={styles.new}>new</span>
};

export default function SearchRankBoard({ data }: SearchRankBoardProps) {
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	return (
		<ul className={styles.searchRankBoard}>
			{data?.map((data, i) => (
				<li key={i}>
					<Accordion
						className={styles.accordion}
						open={openIndex === i}
						onChange={() => setOpenIndex(openIndex === i ? null : i)}>
						<Accordion.Header className={styles.accordionHeader}>
							<span className={styles.rank}>{i + 1}</span>
							<div className={styles.state}>{stateIcon[data.state]}</div>
							<span className={styles.search}>{data.search}</span>
						</Accordion.Header>
						<Accordion.Body className={styles.accordionBody}>
							{data.products.length > 0 && (
								<MySwiper className={styles.swiper} slidesPerView={3} slidesOffsetAfter>
									{data.products.map(el => {
										return (
											<ProductCard
												product={el}
												key={el._id}
												imageSizes="15vw"
												size="sm"
											/>
										);
									})}
								</MySwiper>
							)}

							<Divider />

							<div className={styles.bottom}>
								{data.products.length > 0 ? (
									<Link
										className={styles.moreButton}
										href={`/explorer/result/product?search=${data.search}`}>
										상품 더 보러가기
									</Link>
								) : (
									<p>검색결과가 없습니다.</p>
								)}
							</div>
						</Accordion.Body>
					</Accordion>
				</li>
			))}
		</ul>
	);
}
