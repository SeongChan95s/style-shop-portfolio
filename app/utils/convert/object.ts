export const formDataToNested = (formData: FormData): Record<string, unknown> => {
	const flatObject = Array.from(formData.entries()).reduce(
		(acc, [name, value]) => {
			if (value !== '') {
				acc[name] = value as string;
			}
			return acc;
		},
		{} as Record<string, string>
	);

	const result: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(flatObject)) {
		const keys = key.split('.');
		let curr: Record<string, unknown> = result;

		keys.forEach((k, i) => {
			if (i === keys.length - 1) {
				curr[k] = value;
			} else {
				if (!curr[k] || typeof curr[k] !== 'object') {
					curr[k] = {};
				}
				curr = curr[k] as Record<string, unknown>;
			}
		});
	}

	// 숫자 키를 가진 객체들을 배열로 변환
	const convertObjectsToArrays = (
		obj: Record<string, unknown>
	): Record<string, unknown> => {
		const converted: Record<string, unknown> = {};

		for (const [key, val] of Object.entries(obj)) {
			if (val && typeof val === 'object' && !Array.isArray(val)) {
				const objVal = val as Record<string, unknown>;
				const keys = Object.keys(objVal);

				const isAllNumericKeys = keys.every(k => /^\d+$/.test(k));

				if (isAllNumericKeys && keys.length > 0) {
					const sortedKeys = keys.sort((a, b) => parseInt(a) - parseInt(b));
					converted[key] = sortedKeys.map(k => objVal[k]);
				} else {
					converted[key] = convertObjectsToArrays(objVal);
				}
			} else {
				converted[key] = val;
			}
		}

		return converted;
	};

	return convertObjectsToArrays(result);
};
