/**
 * 객체를 쿼리 스트링으로 만들어주는 유틸함수
 * @params 대상 객체
 * @returns 쿼리스트링
 */
export const objectToQueryString = (params: Record<string, unknown>): string => {
	return Object.keys(params)
		.filter(key => params[key] !== undefined)
		.map(key => {
			let value = params[key];
			if ((value !== null && typeof value === 'object') || Array.isArray(value)) {
				value = JSON.stringify(value);
			}
			return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
		})
		.join('&');
};
