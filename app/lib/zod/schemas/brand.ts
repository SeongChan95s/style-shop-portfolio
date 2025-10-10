import { ObjectId } from 'mongodb';
import z from 'zod';

export const BrandFormSchema = z.object({
	_id: z.instanceof(ObjectId),
	name: z.object({
		main: z.string().min(1, '브랜드명을 입력해주세요.'),
		sub: z.string().min(1, '별칭을 입력해주세요.')
	}),
	images: z.array(z.string()).optional(),
	desc: z.string().min(1, '브랜드 소개를 입력해주세요.'),
	country: z.string().min(1, '국가를 선택해주세요.'),
	since: z.number().min(1, '설립연도를 입력해주세요.')
});

export type BrandFormData = z.infer<typeof BrandFormSchema> & {
	files?: FileList;
};
