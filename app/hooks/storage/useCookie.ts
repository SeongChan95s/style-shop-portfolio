import { useCallback, useEffect, useState } from 'react';

export interface CookieOptions {
	path?: string;
	maxAge?: number;
	expires?: Date;
	domain?: string;
}

export const useCookie = () => {
	const [cookies, setCookies] = useState<string>();

	useEffect(() => {
		const cookie = document.cookie;
		setCookies(cookie);
	}, []);

	const setCookie = useCallback((
		name: string,
		value: string,
		options: CookieOptions = {}
	) => {
		let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

		if (options.maxAge !== undefined) {
			cookieStr += `; max-age=${options.maxAge}`;
		}
		if (options.expires) {
			cookieStr += `; expires=${options.expires.toUTCString()}`;
		}
		if (options.path) {
			cookieStr += `; path=${options.path}`;
		}
		if (options.domain) {
			cookieStr += `; domain=${options.domain}`;
		}
		document.cookie = cookieStr;
		
		// 상태 업데이트
		setCookies(document.cookie);
	}, []);

	const getCookie = useCallback((name: string): string | undefined => {
		const cookies = document.cookie ? document.cookie.split('; ') : [];
		for (const cookie of cookies) {
			const [key, ...rest] = cookie.split('=');
			if (decodeURIComponent(key) === name) {
				return decodeURIComponent(rest.join('='));
			}
		}
		return undefined;
	}, []);

	const pushCookie = useCallback((
		name: string,
		value: string,
		options: CookieOptions = {}
	) => {
		const prev = getCookie(name);
		const values: string[] = prev ? prev.split(',') : [];
		if (!values.includes(value)) {
			values.push(value);
		}
		setCookie(name, values.join(','), options);
	}, [getCookie, setCookie]);

	return {
		cookies,
		setCookie,
		getCookie,
		pushCookie
	};
};
