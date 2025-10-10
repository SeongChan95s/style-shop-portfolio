'use client';

import { useRouter } from 'next/navigation';
import { Button } from '../components/common/Button';

export default function Error({
	error,
	reset
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const router = useRouter();

	return (
		<div>
			<h4>에러입니다.</h4>
			<p>{error.message}</p>
			<Button onClick={() => router.back()}>뒤로가기</Button>
			<Button onClick={() => reset()}>다시 시도하기</Button>
		</div>
	);
}
