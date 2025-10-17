import { regEmail, regPassword } from '@/app/constants';
import { regPhone } from '@/app/constants/constants';
import z from 'zod';

export const completeProfileSchema = z.object({
	email: z
		.string()
		.min(1, '이메일을 입력해주세요.')
		.email('올바른 이메일 형식을 입력해주세요.'),
	name: z
		.string()
		.min(2, '닉네임은 2자 이상 입력해주세요.')
		.max(20, '닉네임은 20자 이하로 입력해주세요.')
		.regex(
			/^[가-힣a-zA-Z0-9_]+$/,
			'닉네임은 한글, 영문, 숫자, 언더스코어만 사용 가능합니다.'
		)
});
export type CompleteProfileFormData = z.infer<typeof completeProfileSchema>;

export const findPasswordSchema = z.object({
	email: z.string().regex(regEmail, '이메일 형식이 아닙니다.')
});

export const verifyResetCodeSchema = z.object({
	email: z.string().regex(regEmail, '이메일 형식이 아닙니다.'),
	code: z.string().regex(/^\d{6}$/, '인증번호는 6자리 숫자입니다.')
});

export const resetPasswordSchema = z
	.object({
		email: z.string().regex(regEmail, '이메일 형식이 아닙니다.'),
		password: z
			.string()
			.regex(regPassword, '비밀번호는 영문 숫자 조합 8자리 이상 작성해주세요.'),
		passwordConfirm: z.string()
	})
	.refine(data => data.password === data.passwordConfirm, {
		message: '비밀번호가 일치하지 않습니다.',
		path: ['passwordConfirm']
	});

export const findMyIdSchema = z.object({
	name: z.string(),
	tel: z.string().regex(regPhone, '전화번호 형식이 아닙니다')
});
