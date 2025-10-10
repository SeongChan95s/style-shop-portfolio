import { useRouter } from 'next/navigation';
import { checkIsApp } from '../utils/pwa';

export default function useViewTransition() {
	const router = useRouter();

	const handleViewTransition = (href: string | 'back', transition?: string) => {
		let navigate;
		if (href == 'back') {
			navigate = () => router.back();
		} else {
			navigate = () => router.push(href);
		}

		if (checkIsApp() && document.startViewTransition && transition) {
			document.documentElement.dataset.viewTransitionType = transition;
			document.startViewTransition(navigate);
		} else {
			navigate();
		}
	};

	return { handleViewTransition };
}
