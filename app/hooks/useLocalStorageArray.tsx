import { useEffect, useState } from 'react';

export default function useLocalStorageArray<T, I extends T[]>(
	key: string,
	initialValue: I
) {
	const [localStorageItems, setLocalStorageItems] = useState<I>();

	useEffect(() => {
		const getLocalStorage = localStorage.getItem(key) as string;
		const parsedLocalStorage = JSON.parse(getLocalStorage);

		if (getLocalStorage) {
			setLocalStorageItems(parsedLocalStorage);
		} else {
			setLocalStorageItems(initialValue);
		}
	}, []);

	const get = () => {
		return localStorageItems ?? initialValue;
	};

	const set = (newValue: T) => {
		localStorage.setItem(key, JSON.stringify(newValue));
	};

	const push = (newValue: T) => {
		if (localStorageItems) {
			localStorage.setItem(key, JSON.stringify([...localStorageItems, newValue]));
		}
	};

	return { get, set, push };
}
