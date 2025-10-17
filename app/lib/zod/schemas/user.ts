import { regPhone, regName, regPassword } from '@/app/constants/constants';
import z from 'zod';

export const addressSchema = z.object({
	_id: z.string(),
	name: z.string().min(1, '이름을 입력해주세요.'),
	tel: z
		.string()
		.min(1, '전화번호를 입력해주세요.')
		.regex(regPhone, '전화번호 형식에 맞지 않습니다.'),
	post: z.object({
		code: z.string().min(1, '우편번호를 입력해주세요.'),
		road: z.string().min(1, '주소를 입력해주세요.'),
		detail: z.string().optional()
	}),
	default: z.boolean()
});

export const updateUserSchema = z
	.object({
		name: z.string().regex(regName, '2글자 이상 입력해주세요.'),
		tel: z.string().regex(regPhone, '전화번호 형식에 맞지 않습니다.'),
		password: z
			.string()
			.optional()
			.refine(val => !val || regPassword.test(val), {
				message: '영문&숫자 조합 8자리 이상 입력해주세요.'
			}),
		passwordConfirm: z.string().optional()
	})
	.refine(
		data => {
			if (data.password && data.password.length > 0) {
				return data.password === data.passwordConfirm;
			}
			return true;
		},
		{
			message: '비밀번호가 일치하지 않습니다.',
			path: ['passwordConfirm']
		}
	);

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
