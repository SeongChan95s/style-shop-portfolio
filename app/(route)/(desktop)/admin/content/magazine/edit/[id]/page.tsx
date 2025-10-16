'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import MagazineForm from './MagazineForm';
import { getContents } from '@/app/services/contents/getContents';
import { Magazine } from '@/app/types';

export default function MagazineEditPage() {
	const params = useParams();
	const magazineId = params.id as string;
	const isNew = magazineId === 'new';

	const { data, isPending, isError } = useQuery({
		queryFn: () => getContents<Magazine>({ match: { _id: magazineId } }),
		queryKey: ['magazine', magazineId],
		enabled: !isNew
	});

	if (isPending && !isNew) {
		return (
			<div className="inner">
				<div>매거진 정보를 불러오는 중...</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="inner">
				<div>매거진을 찾을 수 없습니다.</div>
			</div>
		);
	}

	return (
		<MagazineForm
			initialMagazine={data && data.success ? data.data[0] : undefined}
			isNew={isNew}
		/>
	);
}
