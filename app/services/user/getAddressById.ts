import { HTTPError } from '../HTTPError';
import { Address, FetchResponse } from '@/app/types';

export const getAddressById = async (
	id: string
): Promise<FetchResponse<Address<string>>> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/user/getAddressById?id=${id}`
	);
	const result: FetchResponse<Omit<Address<string>, 'default'> & { default: string }> =
		await response.json();
	if (!response.ok) throw new HTTPError(result.message, response.status, response.url);

	if (result.success) result.data.default = JSON.parse(result.data.default);

	return result as FetchResponse<Address<string>>;
};
