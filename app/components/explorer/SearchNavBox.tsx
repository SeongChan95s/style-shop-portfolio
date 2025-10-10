import { useEffect, useState } from 'react';
import { IconSearchOutlined } from '../common/Icon';
import { useRouter, useSearchParams } from 'next/navigation';
import { classNames } from '@/app/utils';
import styles from './SearchBox.module.scss';

interface SearchBoxProps {
	enabled?: boolean;
}

export default function SearchNavBox({ enabled = false }: SearchBoxProps) {
	const [search, setSearch] = useState('');
	const router = useRouter();
	const params = useSearchParams();

	useEffect(() => {
		const searchParam = params.get('search') ?? '';
		setSearch(searchParam);
	}, [params.get('search')]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (enabled) {
			router.push(`/explorer/result/product?search=${search}`);
		} else {
			router.push(`/explorer/menu`);
		}
	};

	const changeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
	};

	const className = classNames(styles.searchNavBox, enabled && styles.enabled);

	return (
		<div className={className}>
			<form onSubmit={handleSubmit}>
				<div className={styles.container}>
					{enabled && (
						<input
							name="search"
							placeholder="키워드 또는 브랜드 입력"
							value={search}
							autoFocus
							onChange={changeSearch}
						/>
					)}

					<button className={styles.searchButton} type="submit">
						<IconSearchOutlined size="lg" />
					</button>
				</div>
			</form>
		</div>
	);
}
