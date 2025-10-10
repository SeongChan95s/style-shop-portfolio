'use client';

import { useSystemAlertStore } from '@/app/store/globalStore';
import { Toast } from '../common/Toast';
import { useEffect, useRef, useState } from 'react';

export default function SystemAlert() {
	const alertShift = useSystemAlertStore(state => state.shift);
	const timer = useRef<NodeJS.Timeout>(setTimeout(() => {}));
	const [stack, setStack] = useState<string[]>([]);

	useEffect(() => {
		const unsubscribe = useSystemAlertStore.subscribe(
			state => state.alerts,
			(current, prev) => {
				// 새 알럿을 스택으로 이동시킨다.
				if (prev.length < current.length) {
					const newAlerts = current.slice(-1);
					setStack(state => [...state, ...newAlerts]);
					alertShift(); // 이동시킨뒤 삭제
				}

				// 알럿을 다 봤으면 스택을 비운다.
				if (prev.length > current.length && current.length == 0) {
					clearTimeout(timer.current);

					timer.current = setTimeout(() => {
						setStack([]);
					}, 1000 * 6);
				}
			}
		);

		return () => unsubscribe();
	}, []);

	return stack.map((el, i) => {
		return (
			<Toast isVisible={true} key={i}>
				{el}
			</Toast>
		);
	});
}
