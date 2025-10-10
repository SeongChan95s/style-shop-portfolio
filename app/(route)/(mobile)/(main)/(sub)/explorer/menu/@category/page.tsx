'use client';

import { useQuery } from '@tanstack/react-query';
import { Tab } from '@/app/components/common/Tab';
import { Link } from '@/app/components/common/Link';
import Image from 'next/image';
import { getMatchData } from '@/app/services/db/getMatchData';
import { CategoryTypeInPart } from '@/app/types';
import styles from './../menu.module.scss';

export default function CategoryPage() {
	const { data, isPending, isError } = useQuery({
		queryFn: () =>
			getMatchData<CategoryTypeInPart<string>[]>('etc', { name: 'category' }),
		queryKey: ['product', 'category']
	});

	if (isPending || isError) return <></>;
	if (!data.success) return <></>;

	const category = data.data;

	const groupedByPart = category.reduce(
		(acc: Record<string, CategoryTypeInPart<string>[]>, item) => {
			if (!acc[item.part]) {
				acc[item.part] = [];
			}
			acc[item.part].push(item);
			return acc;
		},
		{}
	);

	const parts = Object.keys(groupedByPart);

	return (
		<Tab className={styles.categoryMenu} defaultKey={parts[0]} direction="vertical">
			<Tab.Header className={styles.depth02TabHeader}>
				{parts.map(part => (
					<Tab.Pane
						className={styles.depth02TabPane}
						eventKey={part}
						key={`${part}TabPane`}>
						{part}
					</Tab.Pane>
				))}
			</Tab.Header>
			<Tab.Body className={styles.depth02TabBody}>
				{parts.map(part => (
					<Tab.Item className={styles.depth02Item} eventKey={part} key={`${part}TabItem`}>
						{groupedByPart[part].map(item => (
							<Link
								href={`/explorer/result/product?search=${item.type}`}
								className={styles.link}
								key={item._id}>
								<div className={styles.thumbnail}>
									<Image
										src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/category/${item.image}`}
										alt={item.type}
										width={60}
										height={60}
									/>
								</div>
								<p>{item.type}</p>
							</Link>
						))}
					</Tab.Item>
				))}
			</Tab.Body>
		</Tab>
	);
}
