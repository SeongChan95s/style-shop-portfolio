type NestedObject = { [key: string]: unknown };

export const getValueByPath = <T extends NestedObject>(obj: T, path: string): string => {
	const value = path.split('.').reduce<unknown>((acc, key) => {
		if (typeof acc !== 'object' || acc === null) return '';
		return (acc as Record<string, unknown>)[key] ?? '';
	}, obj);

	if (typeof value == 'number') return value.toLocaleString();

	if (Array.isArray(value)) {
		return value.join(', ');
	}
	if (Array.isArray(value) || typeof value == 'object') return JSON.stringify(value);
	return String(value ?? '');
};
