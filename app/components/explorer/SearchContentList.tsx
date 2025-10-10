'use client';

import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { ProductCard } from '@/app/components/product';
import { getContents } from '@/app/services/contents';
import { Link } from '../common/Link';
import Image from 'next/image';
import styles from './SearchContentList.module.scss';

interface SearchContentListProps {
	search?: string;
	selectedFilter?: Record<string, string[]>;
	match?: {
		group?: Record<string, unknown>;
		item?: Record<string, unknown>;
	};
}

export default function SearchContentList({
	search,
	selectedFilter,
	match
}: SearchContentListProps) {
	const createMatchFilter = useCallback(() => {
		let filterMatch = {};
		let finalMatch = match || {};

		if (selectedFilter) {
			const activeGroups = Object.entries(selectedFilter).filter(
				([_, values]) => values.length > 0
			);

			if (activeGroups.length > 0) {
				if (activeGroups.length === 1) {
					const [_, values] = activeGroups[0];
					filterMatch = { keywords: { $in: values } };
				} else {
					const andConditions = activeGroups.map(([_, values]) => ({
						keywords: { $in: values }
					}));
					filterMatch = { $and: andConditions };
				}
			}
		}

		if (Object.keys(filterMatch).length > 0) {
			finalMatch = {
				...finalMatch,
				...filterMatch
			};
		}

		return Object.keys(finalMatch).length > 0 ? finalMatch : undefined;
	}, [match, selectedFilter]);

	const { data, isError, isPending } = useQuery({
		queryFn: async ({ pageParam: skip }) =>
			await getContents({
				search,
				match: createMatchFilter()
			}),
		queryKey: ['search', 'content', search, createMatchFilter()]
	});

	if (isError) return <></>;
	if (isPending)
		return (
			<>
				<ProductCard.Skeleton />
				<ProductCard.Skeleton />
				<ProductCard.Skeleton />
				<ProductCard.Skeleton />
			</>
		);

	if (!data || !data.success) return <></>;
	const contents = data.data;
	const groupContents = contents?.reduce(
		(acc, content) => {
			if (!acc[content.name]) {
				acc[content.name] = [];
			}
			acc[content.name].push(content);
			return acc;
		},
		{} as Record<string, typeof contents>
	);

	return (
		<div className={styles.searchContentList}>
			<div className={styles.grid}>
				{groupContents &&
					Object.keys(groupContents).map(group => (
						<div className={`${styles.group} ${styles[group]}`} key={group}>
							<header className="inner">
								<h4>{group}</h4>
							</header>
							<div className={styles.contents}>
								{(() => {
									switch (group) {
										case '매거진':
											return groupContents[group].map(content => (
												<Link href="#" key={content._id.toString()}>
													<div className={styles.thumbnail}>
														<Image
															src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${content.images[0]}`}
															fill
															sizes="50vw"
															alt={content.title}
															loading="eager"
														/>
													</div>
													<div className={styles.container}>
														<p className={styles.type}>{content.name}</p>
														<h5>{content.title}</h5>
														<p className={styles.body}>{content.body}</p>
													</div>
												</Link>
											));
										case '이벤트':
											return groupContents[group].map(content => (
												<Link href="#" key={content._id.toString()}>
													<Image
														src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${content.images[0]}`}
														width={22}
														height={22}
														alt={content.title}
														loading="eager"
													/>
													{content.title}
												</Link>
											));
										case '쇼케이스':
											return groupContents[group].map(content => (
												<Link href="#" key={content._id.toString()}>
													<div className={styles.thumbnail}>
														<Image
															src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${content.images[0]}`}
															fill
															sizes="50vw"
															alt={content.title}
															loading="eager"
														/>
													</div>
													<div className={styles.container}>
														<p className={styles.type}>{content.name}</p>
														<h5>{content.title}</h5>
														<p className={styles.body}>{content.body}</p>
													</div>
												</Link>
											));
									}
								})()}
							</div>
						</div>
					))}
			</div>
		</div>
	);
}
