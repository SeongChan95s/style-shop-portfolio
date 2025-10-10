import { ObjectId } from 'mongodb';
import z from 'zod';

export const orderSchema = z.object({
	_id: z.string().transform(val => new ObjectId(val)),
	userEmail: z.string(),
	address: z.object({
		_id: z.string().transform(val => new ObjectId(val)),
		name: z.string(),
		tel: z.string(),
		post: z.object({
			code: z.string(),
			road: z.string(),
			detail: z.string().optional()
		})
	}),
	products: z.array(
		z.object({
			productItemId: z.string().transform(val => new ObjectId(val)),
			count: z.transform(val => Number(val))
		})
	),
	payment: z
		.object({
			method: z.string(),
			price: z
				.string()
				.optional()
				.transform(val => Number(val)),
			discount: z
				.string()
				.optional()
				.transform(val => Number(val)),
			total: z
				.string()
				.optional()
				.transform(val => Number(val))
		})
		.optional(),
	status: z.string().optional(),
	timestamp: z.number()
});
