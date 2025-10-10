import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
	try {
		const { removedImage } = await req.json();

		const s3Client = new S3Client({
			region: 'ap-northeast-2',
			credentials: {
				accessKeyId: process.env.ACCESS_KEY!,
				secretAccessKey: process.env.SECRET_KEY!
			}
		});

		const params = {
			Bucket: process.env.BUCKET_NAME!,
			Key: removedImage
		};

		await s3Client.send(new DeleteObjectCommand(params));

		return NextResponse.json('이미지를 삭제했습니다.');
	} catch (err) {
		return NextResponse.json({ message: `${err}` }, { status: 500 });
	}
}
