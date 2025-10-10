import { FetchResponse } from '@/app/types';
import { getFileFormat } from '@/app/utils/utils';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

export async function s3Upload(
	files: File[],
	baseKey: string,
	maxSizeMb = 3
): Promise<FetchResponse<string[]>> {
	try {
		for (const file of files) {
			if (file.size > maxSizeMb * 1024 * 1024) {
				return {
					success: false,
					message: `파일명 "${file.name}"이 최대 크기 ${maxSizeMb}MB를 초과했습니다. (현재: ${(file.size / 1024 / 1024).toFixed(2)}MB)`
				};
			}
		}

		const renameFiles = (files: File[]): File[] => {
			return files.map(file => {
				const newName = `${baseKey}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${getFileFormat(file.name)}`;

				return new File([file], newName, {
					type: file.type,
					lastModified: file.lastModified
				});
			});
		};

		const modifiedFiles = renameFiles(files);

		const s3 = new S3Client({
			region: 'ap-northeast-2',
			credentials: {
				accessKeyId: process.env.ACCESS_KEY!,
				secretAccessKey: process.env.SECRET_KEY!
			}
		});

		const getPresigned = async (file: File) => {
			const presigned = await createPresignedPost(s3, {
				Bucket: process.env.BUCKET_NAME!,
				Key: file.name,
				Expires: 60,
				Conditions: [['content-length-range', 0, maxSizeMb * 1024 * 1024]]
			});

			return presigned;
		};

		const uploadFile = async (
			file: File,
			presigned: { url: string; fields: Record<string, string> }
		) => {
			const formData = new FormData();
			Object.entries(presigned.fields).forEach(([key, value]) => {
				formData.append(key, value as string);
			});
			formData.append('file', file);

			const uploadResponse = await fetch(presigned.url, {
				method: 'POST',
				body: formData
			});

			if (!uploadResponse.ok) {
				throw new Error(`${file.name} 업로드 실패`);
			}

			return {
				success: true,
				fileName: file.name
			};
		};

		const deleteUploadedFiles = async (fileNames: string[]) => {
			try {
				await Promise.all(
					fileNames.map(fileName =>
						s3.send(
							new DeleteObjectCommand({
								Bucket: process.env.BUCKET_NAME!,
								Key: fileName
							})
						)
					)
				);
			} catch (deleteError) {
				console.error('파일 삭제 중 오류:', deleteError);
			}
		};

		const presignedResults = await Promise.all(
			modifiedFiles.map(async file => {
				const presigned = await getPresigned(file);
				return { file, presigned };
			})
		);

		const uploadedFiles: string[] = [];

		for (const { file, presigned } of presignedResults) {
			try {
				await uploadFile(file, presigned);
				uploadedFiles.push(file.name);
			} catch (uploadError) {
				// 업로드 실패 시 이전에 업로드된 파일들 삭제
				if (uploadedFiles.length > 0) {
					await deleteUploadedFiles(uploadedFiles);
				}
				throw uploadError;
			}
		}

		return {
			success: true,
			message: `총 ${files.length}개의 파일을 업로드했습니다`,
			data: uploadedFiles
		};
	} catch (error) {
		return {
			success: false,
			message: `${error} 이유로 업로드에 실패했습니다.`
		};
	}
}
