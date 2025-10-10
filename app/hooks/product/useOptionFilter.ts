import { useEffect, useMemo, useState } from 'react';

type OptionsWithStock = { [key: string]: string } & { stock: string };

export const useOptionFilter = (options: OptionsWithStock[]) => {
	const [selectedOptions, setSelectedOptions] = useState<{
		[key: string]: string | null;
	}>({});

	const optionKeys = useMemo(() => {
		if (!Array.isArray(options) || !options.length) return [];
		return Object.keys(options[0]).filter(key => key !== 'stock');
	}, [options]);

	useEffect(() => {
		setSelectedOptions({});
	}, [JSON.stringify(options)]);

	const filteredOptions = useMemo(() => {
		const result: { [key: string]: Array<{ value: string; stock: string }> } = {};
		optionKeys.forEach(key => {
			let filteredRows = options;
			optionKeys.forEach(k => {
				if (k !== key && selectedOptions[k]) {
					filteredRows = filteredRows.filter(row => row[k] === selectedOptions[k]);
				}
			});

			const uniqueValues = new Map<string, string>();
			filteredRows.forEach(row => {
				const value = row[key];
				if (!uniqueValues.has(value)) {
					uniqueValues.set(value, row.stock);
				}
			});

			result[key] = Array.from(uniqueValues.entries()).map(([value, stock]) => ({
				value,
				stock
			}));
		});
		return result;
	}, [optionKeys, selectedOptions, JSON.stringify(options)]);

	const handleOption = (key: string, value: string) => {
		setSelectedOptions(prev => ({
			...prev,
			[key]: value
		}));
	};

	return { optionKeys, selectedOptions, handleOption, filteredOptions };
};
