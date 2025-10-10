'use server';

import { FetchResponse } from '@/app/types';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';

export const s3Delete = async (keys: string[]): Promise<FetchResponse> => {
	try {
		const s3Client = new S3Client({
			region: 'ap-northeast-2',
			credentials: {
				accessKeyId: process.env.ACCESS_KEY!,
				secretAccessKey: process.env.SECRET_KEY!
			}
		});

		const params = keys.map(key => ({
			Bucket: process.env.BUCKET_NAME!,
			Key: key
		}));

		await Promise.all(
			params.map(param => {
				return s3Client.send(new DeleteObjectCommand(param));
			})
		);

		return {
			success: true,
			message: '이미지를 삭제했습니다.'
		};
	} catch (error) {
		return {
			success: false,
			message: `${error}`
		};
	}
};
