export default function dotFormDataToObject<T>(formData: FormData): T {
	const result: Record<string, unknown> = {};

	const parseValue = (value: FormDataEntryValue): unknown => {
		if (typeof value !== 'string') return value;

		if (value === 'true') return true;
		if (value === 'false') return false;

		return value;
	};

	for (const [key, value] of formData.entries()) {
		const keys = key.split('.');
		let curr: Record<string, unknown> = result;
		keys.forEach((k, i) => {
			if (i === keys.length - 1) {
				curr[k] = parseValue(value);
			} else {
				if (!curr[k] || typeof curr[k] !== 'object') {
					curr[k] = {};
				}
				curr = curr[k] as Record<string, unknown>;
			}
		});
	}
	return result as T;
}
