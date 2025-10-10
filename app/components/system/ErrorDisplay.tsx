'use client';

import { Button } from '../common/Button';
import { useRouter } from 'next/navigation';

export default function ErrorDisplay({ message }: { message: string }) {
	const router = useRouter();

	return (
		<div>
			<p>문제가 발생했습니다. {message}</p>
			<Button onClick={() => router.refresh()}>새로고침</Button>
		</div>
	);
}
