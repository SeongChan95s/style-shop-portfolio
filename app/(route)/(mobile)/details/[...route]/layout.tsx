import { handleFetch } from '@/app/utils';
import { getProductNestedByItemId } from '@/app/services/product';
import styles from './details.module.scss';

export async function generateMetadata({
	params
}: {
	params: Promise<{ route: string[] }>;
}) {
	const { route } = await params;
	const itemId = route[route.length - 1];
	const [data, error] = await handleFetch({
		queryFn: getProductNestedByItemId(itemId)
	});

	if (error) return { title: '상품을 찾을 수 없음' };
	const product = data.success ? data.data : null;

	return {
		title: product?.name ? `상품 상세 | ${product.name}` : '상품 상세'
	};
}

export default function DetailsLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<main id={styles.detailsLayout}>{children}</main>
		</>
	);
}
