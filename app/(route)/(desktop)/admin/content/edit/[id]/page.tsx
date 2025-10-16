'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import ContentForm from './ContentForm';
import { getContents } from '@/app/services/contents/getContents';
import { Content } from '@/app/types';

export default function ContentEditPage() {
	const params = useParams();
	const contentId = params.id as string;
	const isNew = contentId === 'new';

	const { data, isPending, isError } = useQuery({
		queryFn: () => getContents<Content>({ match: { _id: contentId } }),
		queryKey: ['content', contentId],
		enabled: !isNew
	});

	if (isPending && !isNew) {
		return (
			<div className="inner">
				<div>콘텐츠 정보를 불러오는 중...</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="inner">
				<div>콘텐츠를 찾을 수 없습니다.</div>
			</div>
		);
	}

	return (
		<ContentForm
			initialContent={data && data.success ? data.data[0] : undefined}
			isNew={isNew}
		/>
	);
}
