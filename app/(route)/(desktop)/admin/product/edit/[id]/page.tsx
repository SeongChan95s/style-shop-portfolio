'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { getProductNestedById } from '@/app/services/product/getProductNestedById';
import ProductForm from './ProductForm';

export default function ProductEditPage() {
	const params = useParams();
	const productId = params.id as string;
	const isNew = productId === 'new';

	const {
		data,
		isPending,
		isError,
		refetch: _refetch
	} = useQuery({
		queryFn: () => getProductNestedById(productId),
		queryKey: ['product', productId],
		enabled: !isNew
	});

	if (isPending && !isNew) {
		return (
			<div className="inner">
				<div>상품 정보를 불러오는 중...</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="inner">
				<div>상품을 찾을 수 없습니다.</div>
			</div>
		);
	}

	return (
		<ProductForm
			initialProduct={data && data.success ? data?.data : undefined}
			isNew={isNew}
		/>
	);
}
