import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		const searchParams = req.nextUrl.searchParams;
		const path = searchParams.get('path') as string;

		const s3Client = new S3Client({
			region: 'ap-northeast-2',
			credentials: {
				accessKeyId: process.env.ACCESS_KEY!,
				secretAccessKey: process.env.SECRET_KEY!
			}
		});

		const listParams = {
			Bucket: process.env.BUCKET_NAME!,
			Prefix: path.endsWith('/') ? path : `${path}/`
		};
		const listedObjects = await s3Client.send(new ListObjectsV2Command(listParams));

		if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
			return NextResponse.json(
				{ success: true, message: `폴더 내 파일이 없습니다.`, data: null },
				{ status: 200 }
			);
		}

		const filesKey = listedObjects.Contents.map(con => con.Key).filter(
			key => key != `${path}/`
		);

		return NextResponse.json(
			{ success: true, message: `이미지 정보를 가져왔습니다.`, data: filesKey },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json({ success: false, message: `${err}` }, { status: 500 });
	}
}
