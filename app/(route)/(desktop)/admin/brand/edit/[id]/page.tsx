'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import BrandForm from './BrandForm';
import { getBrands } from '@/app/services/brand/getBrands';

export default function BrandEditPage() {
	const params = useParams();
	const brandId = params.id as string;
	const isNew = brandId === 'new';

	const { data, isPending, isError } = useQuery({
		queryFn: () => getBrands({ match: { _id: brandId } }),
		queryKey: ['brand', brandId],
		enabled: !isNew
	});

	if (isPending && !isNew) {
		return (
			<div className="inner">
				<div>브랜드 정보를 불러오는 중...</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="inner">
				<div>브랜드를 찾을 수 없습니다.</div>
			</div>
		);
	}

	return (
		<BrandForm
			initialBrand={data && data.success ? data.data[0] : undefined}
			isNew={isNew}
		/>
	);
}
