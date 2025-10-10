import { HTTPError } from '../HTTPError';

export const s3DeleteFolder = async (folderPrefix: string) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/s3/deleteFolder`,
		{
			method: 'DELETE',
			body: JSON.stringify({ folderPrefix })
		}
	);

	const result = await response.json();

	if (!response.ok)
		throw new HTTPError(
			`${result.message} 이유로 폴더 삭제에 실패했습니다.`,
			response.status,
			response.url
		);

	return result;
};
