import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
	try {
		const { folderPrefix } = await req.json();

		const s3Client = new S3Client({
			region: 'ap-northeast-2',
			credentials: {
				accessKeyId: process.env.ACCESS_KEY!,
				secretAccessKey: process.env.SECRET_KEY!
			}
		});

		// 1. 폴더(프리픽스) 하위 모든 객체 조회
		const listParams = {
			Bucket: process.env.BUCKET_NAME!,
			Prefix: folderPrefix.endsWith('/') ? folderPrefix : `${folderPrefix}/`
		};
		const listedObjects = await s3Client.send(new ListObjectsV2Command(listParams));

		if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
			// 폴더가 비어있거나 없음
			return { message: '폴더 내 파일이 없습니다.' };
		}

		// 2. 객체 일괄 삭제
		const deleteParams = {
			Bucket: process.env.BUCKET_NAME!,
			Delete: {
				Objects: listedObjects.Contents.map(obj => ({ Key: obj.Key! })),
				Quiet: true
			}
		};
		await s3Client.send(new DeleteObjectsCommand(deleteParams));

		return NextResponse.json({ message: `폴더를 삭제했습니다.` }, { status: 200 });
	} catch (err) {
		return NextResponse.json({ message: `${err}` }, { status: 500 });
	}
}
