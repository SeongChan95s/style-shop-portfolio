export const formDataToObject = <T>(formData: FormData) => {
	return Array.from(formData.entries()).reduce(
		(acc, [name, value]) => {
			if (value !== '') {
				acc[name] = value;
			}
			return acc;
		},
		{} as Record<string, FormDataEntryValue>
	) as T;
};
