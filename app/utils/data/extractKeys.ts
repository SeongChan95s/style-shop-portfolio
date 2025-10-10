type NestedObject = { [key: string]: unknown };

export const extractKeys = (data: NestedObject[]): string[] => {
	const keySet = new Set();

	const flattenKeys = (obj: NestedObject, prefix = '') => {
		Object.keys(obj).forEach(key => {
			const currentValue = obj[key];
			const fullKey = prefix ? `${prefix}.${key}` : key;

			if (Array.isArray(currentValue)) {
				keySet.add(fullKey); // 배열 자체를 하나의 키로 처리
			} else if (typeof currentValue === 'object' && currentValue !== null) {
				flattenKeys(currentValue as NestedObject, fullKey); // 객체인 경우 재귀 처리
			} else {
				keySet.add(fullKey); // 일반 값
			}
		});
	};

	data.forEach(item => flattenKeys(item));
	return Array.from(keySet) as string[];
};
