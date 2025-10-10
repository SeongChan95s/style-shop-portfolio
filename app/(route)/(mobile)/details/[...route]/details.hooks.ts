import { useMemo, useState } from 'react';

type Options = { [key: string]: string };

export function useOptionFilter(options: Options[]) {
	const [selectedOptions, setSelectedOptions] = useState<{
		[key: string]: string | null;
	}>({});

	const optionKeys = useMemo(() => {
		if (!Array.isArray(options) || !options.length) return [];
		return Object.keys(options[0]);
	}, [options]);

	const filteredOptions = useMemo(() => {
		const result: { [key: string]: string[] } = {};
		optionKeys.forEach(key => {
			let filteredRows = options;
			optionKeys.forEach(k => {
				if (k !== key && selectedOptions[k]) {
					filteredRows = filteredRows.filter(row => row[k] === selectedOptions[k]);
				}
			});
			result[key] = Array.from(new Set(filteredRows.map(row => row[key])));
		});
		return result;
	}, [optionKeys, selectedOptions, options]);

	const handleOption = (key: string, value: string) => {
		setSelectedOptions(prev => ({
			...prev,
			[key]: value
		}));
	};

	return { optionKeys, selectedOptions, handleOption, filteredOptions };
}
