import { Spinner } from '@/app/components/common/Spinner';

export default function Loading() {
	return (
		<div id="loading" className="onePageLayout centerLayout">
			<Spinner size="lg" />
		</div>
	);
}
