import { getBrands } from '@/app/services/brand/getBrands';
import { handleFetch } from '@/app/utils';
import { notFound } from 'next/navigation';
import BrandHeader from './BrandHeader';
import BrandInfo from './BrandInfo';
import BrandProducts from './BrandProducts';
import { Divider } from '@/app/components/common/Divider';
import styles from './brand.module.scss';

export default async function Brand({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	const [result, error] = await handleFetch({
		queryFn: getBrands({ match: { _id: id } })
	});

	if (error || !result?.success || !result.data?.[0]) {
		notFound();
	}

	const brand = result.data[0];

	return (
		<div className={styles.brandPage}>
			<BrandHeader brand={brand} />
			<BrandInfo brand={brand} />
			<Divider inner />
			<BrandProducts brandName={brand.name.main} />
		</div>
	);
}
