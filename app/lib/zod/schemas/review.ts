import { z } from 'zod';
import { ObjectId } from 'mongodb';

// review formData schema
export const reviewFormDataSchema = z.object({
	_id: z.instanceof(ObjectId),
	productItemId: z.instanceof(ObjectId),
	productGroupId: z.instanceof(ObjectId).optional(),
	orderId: z.instanceof(ObjectId),
	content: z.object({
		text: z
			.string()
			.min(20, '리뷰는 최소 20자 이상 작성해주세요')
			.max(200, '리뷰는 200자 이하로 작성해주세요'),
		images: z.array(z.string()).optional().default([])
	}),
	userEmail: z.string(),
	score: z.coerce
		.number()
		.min(0.5, '평점은 최소 0.5점입니다')
		.max(5, '평점은 최대 5점입니다'),
	timestamp: z.number()
});

export type test = z.infer<typeof reviewFormDataSchema>;
