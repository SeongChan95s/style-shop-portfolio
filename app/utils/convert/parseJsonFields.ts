export const parseJsonFields = <T>(
	obj: Record<string, unknown>,
	fields: (keyof T)[]
): T => {
	const result = { ...obj } as Record<string, unknown>;
	fields.forEach(field => {
		const fieldKey = field as string;
		if (typeof result[fieldKey] === 'string') {
			try {
				result[fieldKey] = JSON.parse(result[fieldKey] as string);
			} catch (_e) {
				// 파싱 실패시 원본 유지
			}
		}
	});
	return result as T;
};
