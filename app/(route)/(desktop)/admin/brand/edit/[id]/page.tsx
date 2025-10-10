'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import BrandForm from './BrandForm';
import { Brand } from '@/app/types';
import { getBrands } from '@/app/services/brand/getBrands';

export default function BrandEditPage() {
	const params = useParams();
	const brandId = params.id as string;
	const isNew = brandId === 'new';

	const emptyBrand: Brand = {
		_id: '',
		name: {
			main: '',
			sub: ''
		},
		desc: '',
		country: '',
		since: 0,
		images: [],
		wishUsers: []
	};

	const { data, isPending, isError } = useQuery({
		queryFn: () => getBrands({ match: { _id: brandId } }),
		queryKey: ['brand', brandId],
		enabled: !!brandId && !isNew
	});

	if (isNew) {
		return <BrandForm initialBrand={emptyBrand} isNew={true} />;
	}

	if (isPending) {
		return (
			<div className="inner">
				<div>브랜드 정보를 불러오는 중...</div>
			</div>
		);
	}

	if (isError || !data?.success) {
		return (
			<div className="inner">
				<div>브랜드를 찾을 수 없습니다.</div>
			</div>
		);
	}

	return <BrandForm initialBrand={data.data[0]} isNew={false} />;
}
