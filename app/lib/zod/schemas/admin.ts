import { ObjectId } from 'mongodb';
import z from 'zod';

export const brandEditFormSchema = z.object({
	_id: z
		.string()
		.or(z.instanceof(ObjectId))
		.transform(val => (typeof val === 'string' ? new ObjectId(val) : val)),
	name: z.object({
		main: z.string().min(1, '브랜드명을 입력해주세요.'),
		sub: z.string().optional()
	}),
	country: z.string().min(1, '국가를 선택해주세요.'),
	since: z.coerce.number().min(1800, '올바른 설립연도를 입력해주세요.'),
	desc: z.string().max(300, '소개는 300자 이내로 입력해주세요.'),
	images: z
		.array(
			z.object({
				state: z.string(),
				key: z.string(),
				file: z.instanceof(File).nullish()
			})
		)
		.nonempty('이미지가 최소 1장 이상 필요합니다.')
});

export const reviewEditFormSchema = z.object({
	_id: z
		.string()
		.or(z.instanceof(ObjectId))
		.transform(val => (typeof val === 'string' ? new ObjectId(val) : val)),
	userEmail: z.string().email('올바른 이메일 주소를 입력해주세요.').optional(),
	productItemId: z
		.string()
		.min(1, '상품 아이템 ID를 입력해주세요.')
		.transform(val => new ObjectId(val)),
	orderId: z
		.string()
		.min(1, '주문 ID를 입력해주세요.')
		.transform(val => new ObjectId(val)),
	score: z.coerce.number().min(1, '별점은 최소 1점입니다.').max(5, '별점은 최대 5점입니다.'),
	content: z.object({
		text: z.string().max(1000, '리뷰 내용은 1000자 이내로 입력해주세요.'),
		images: z.array(
			z.object({
				state: z.string(),
				key: z.string(),
				file: z
					.instanceof(File)
					.superRefine((file, ctx) => {
						if (!file) return;
						if (file.size > 10 * 1024 * 1024) {
							ctx.addIssue({
								code: z.ZodIssueCode.custom,
								message: `파일명 "${file.name}"이 최대 크기 10MB를 초과했습니다. (현재: ${(file.size / 1024 / 1024).toFixed(2)}MB)`
							});
						}
					})
					.nullish()
			})
		)
	})
});

export const productEditFormSchema = z
	.object({
		_id: z.string().transform(val => (val ? new ObjectId(val) : new ObjectId())),
		name: z.string().min(1, '상품명을 입력해주세요.'),
		brand: z.string().min(1, '브랜드명을 입력해주세요.'),
		price: z.object({
			cost: z.coerce.number(),
			discount: z.coerce.number().default(0)
		}),
		category: z.object({
			main: z.string('분류를 선택해주세요.'),
			gender: z.string('성별을 선택해주세요.'),
			part: z.string('파츠를 선택해주세요'),
			type: z.string('타입을 선택해주세요.')
		}),
		keywords: z.array(z.string()).default([]),
		items: z
			.array(
				z.object({
					_id: z
						.string()
						.optional()
						.transform(val => (val ? new ObjectId(val) : new ObjectId())),
					groupId: z
						.string()
						.optional()
						.transform(val => (val ? new ObjectId(val) : undefined)),
					option: z.object({
						color: z.string().min(1, '아이템 컬러를 입력하세요.'),
						size: z.string().min(1, '아이템 사이즈를 입력하세요.')
					}),
					stock: z.coerce.number(),
					images: z
						.array(
							z.object({
								state: z.string(),
								key: z.string(),
								file: z
									.instanceof(File)
									.superRefine((file, ctx) => {
										if (!file) return;
										if (file.size > 10 * 1024 * 1024) {
											ctx.addIssue({
												code: z.ZodIssueCode.custom,
												message: `파일명 "${file.name}"이 최대 크기 10MB를 초과했습니다. (현재: ${(file.size / 1024 / 1024).toFixed(2)}MB)`
											});
										}
									})
									.nullish()
							})
						)
						.nonempty('이미지가 최소 1장 이상 필요합니다.'),
					state: z.string().optional()
				})
			)
			.nonempty('상품 아이템이 1개 이상 필요합니다.')
			.transform(val => Object.values(val))
	})
	.transform(data => {
		const processedItems = data.items.map(item => ({
			...item,
			groupId: item.groupId ?? data._id
		}));

		return {
			...data,
			items: processedItems
		};
	});
