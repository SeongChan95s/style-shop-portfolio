export interface CookieOptions {
	path?: string;
	maxAge?: number;
	expires?: Date;
	domain?: string;
}

export function setCookie(
	name: string,
	value: string,
	options: CookieOptions = {}
): void {
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
}

export function getCookie(name: string): string | undefined {
	const cookies = document.cookie ? document.cookie.split('; ') : [];
	for (const cookie of cookies) {
		const [key, ...rest] = cookie.split('=');
		if (decodeURIComponent(key) === name) {
			return decodeURIComponent(rest.join('='));
		}
	}
	return undefined;
}

export function pushCookie(
	name: string,
	value: string,
	options: CookieOptions = {}
): void {
	const prev = getCookie(name);
	const values: string[] = prev ? prev.split(',') : [];
	if (!values.includes(value)) {
		values.push(value);
	}
	setCookie(name, values.join(','), options);
}
