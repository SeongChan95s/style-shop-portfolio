import { S3Client } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

export async function GET(req: NextRequest) {
	try {
		const searchParams = req.nextUrl.searchParams;
		const key = searchParams.get('key');

		const s3 = new S3Client({
			region: 'ap-northeast-2',
			credentials: {
				accessKeyId: process.env.ACCESS_KEY!,
				secretAccessKey: process.env.SECRET_KEY!
			}
		});

		const presigned = await createPresignedPost(s3, {
			Bucket: process.env.BUCKET_NAME!,
			Key: key!,
			Expires: 60,
			Conditions: [['content-length-range', 0, 1048576]]
		});

		return NextResponse.json(presigned, { status: 200 });
	} catch (err) {
		return NextResponse.json({ message: `${err}` }, { status: 500 });
	}
}
