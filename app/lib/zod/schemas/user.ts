import { regPhone } from '@/app/constants/constants';
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

// export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
