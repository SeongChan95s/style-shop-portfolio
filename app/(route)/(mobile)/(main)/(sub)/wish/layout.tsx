'use client';

import TabIndicator from '@/app/components/common/Tab/TabIndicator';
import { Tab } from '@/app/components/common/Tab';
import { createTransitionClassNames } from '@/app/utils/convert';
import styles from './wish.module.scss';
import { getWishCountByNameAndSession } from '@/app/services/wish/getWishCountByNameAndSession';
import { useQueries } from '@tanstack/react-query';

interface WishLayoutProps {
	product: React.ReactNode;
	brand: React.ReactNode;
	children: React.ReactNode;
}

export default function WishPage({ product, brand, children }: WishLayoutProps) {
	const results = useQueries({
		queries: [
			{
				queryFn: () => getWishCountByNameAndSession('product'),
				queryKey: ['wish', 'product', 'count']
			},
			{
				queryFn: () => getWishCountByNameAndSession('brand'),
				queryKey: ['wish', 'brand', 'count']
			}
		]
	});

	return (
		<div className={styles.wishLayout}>
			<Tab
				className={styles.tab}
				defaultKey="product"
				transitionClassName={createTransitionClassNames('slide')}
				timeout={400}>
				<Tab.Header className={styles.tabHeader}>
					<Tab.Pane eventKey="product">
						상품 {results[0]?.data?.success && results[0].data.data}
					</Tab.Pane>
					<Tab.Pane eventKey="brand">
						브랜드 {results[1]?.data?.success && results[1].data.data}
					</Tab.Pane>
					<TabIndicator />
				</Tab.Header>

				<Tab.Body className={styles.tabBody}>
					<Tab.Item className={styles.tabItem} eventKey="product">
						{product}
					</Tab.Item>
					<Tab.Item className={styles.tabItem} eventKey="brand">
						{brand}
					</Tab.Item>
				</Tab.Body>
			</Tab>
			{children}
		</div>
	);
}
