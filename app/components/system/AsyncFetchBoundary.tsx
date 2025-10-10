'use client';

import { Suspense } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { Skeleton } from '../common/Skeleton';
import { Button } from '../common/Button';

interface AsyncFetchBoundaryProps {
	children: React.ReactNode;
	loadingFallback?: React.ReactNode;
	errorFallback?: (props: FallbackProps) => React.ReactNode;
	isClient?: boolean;
}

function defaultErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
	return (
		<div>
			<p>문제가 발생했습니다 : {error.message}</p>
			<Button onClick={resetErrorBoundary}>새로고침</Button>
		</div>
	);
}

export default function AsyncFetchBoundary({
	isClient = false,
	loadingFallback = <Skeleton inner />,
	errorFallback = defaultErrorFallback,
	children
}: AsyncFetchBoundaryProps) {
	return (
		<>
			{isClient ? (
				<ErrorBoundary fallbackRender={errorFallback}>
					<Suspense fallback={loadingFallback}>{children}</Suspense>
				</ErrorBoundary>
			) : (
				<Suspense fallback={loadingFallback}>{children}</Suspense>
			)}
		</>
	);
}
