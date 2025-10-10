export const regEmail =
	/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i; // 이메일 유효성

export const regPassword = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/; // 영문숫자조합 8자리 이상
export const regName = /^.{2,}$/; // 2자 이상
export const regSpace = /^\s*$/; // 공백문자열
export const regPhone = /^(01[016789]{1})-?[0-9]{3,4}-?[0-9]{4}$/; // 휴대폰번호
