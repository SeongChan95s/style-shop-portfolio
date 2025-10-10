import { HTTPError } from '../HTTPError';

export const s3Delete = async (keys: string) => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/s3/delete`, {
		method: 'DELETE',
		body: JSON.stringify({
			keys
		})
	});

	const result = await response.json();

	if (!response.ok)
		throw new HTTPError(
			`${result.message} 이유로 이미지 삭제에 실패했습니다.`,
			response.status,
			response.url
		);
	return result;
};
