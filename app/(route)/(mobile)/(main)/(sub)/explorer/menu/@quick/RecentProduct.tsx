'use client';

import { ProductCard } from '@/app/components/product';
import { useQuery } from '@tanstack/react-query';
import { MySwiper } from '@/app/components/common/Swiper';
import { ProductNested } from '@/app/types';
import { getProductsNestedByItemsId } from '@/app/services/product';
import { RecentProductSkeleton } from '../menu.skeleton';

export default function RecentProduct() {
	const { data, isFetching, isSuccess } = useQuery<ProductNested[]>({
		queryKey: ['recentProducts'],
		queryFn: async () => {
			const storageProducts = localStorage.getItem('watched');
			const storageProductsArray = storageProducts ? JSON.parse(storageProducts) : [];
			const res = await getProductsNestedByItemsId(storageProductsArray);
			return res.success ? res.data : [];
		}
	});

	return (
		<section className="sectionLayoutSm">
			<header className="headerLayoutMd">
				<div className="inner">
					<h3>최근 본 상품</h3>
				</div>
			</header>
			{isFetching && <RecentProductSkeleton />}
			{isSuccess && (
				<MySwiper slidesPerView={3} spaceBetween="0" slidesOffsetAfter>
					{data?.map((el) => {
						return (
							<ProductCard product={el} key={el._id} imageSizes="20vw" shape="rect" />
						);
					})}
				</MySwiper>
			)}
		</section>
	);
}
