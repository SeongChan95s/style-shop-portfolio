import { FetchResponse, ProductNested } from '@/app/types';
import { getContents } from './getContents';
import { getProductsNestedByGroupsId } from '../product';
import { Content } from '@/app/types';
import { HTTPError } from '../HTTPError';

interface GetContentsWithProductsParams {
	search?: string;
	match?: object;
}

export const getContentsWithProducts = async <
	T extends Content & { productGroupsId: string[]; products: ProductNested[] }
>({
	search,
	match
}: GetContentsWithProductsParams): Promise<FetchResponse<T[]>> => {
	try {
		const response = await getContents<T>({ search, match });

		const contents = response.success ? response.data : [];

		const getProducts = contents.map(content =>
			getProductsNestedByGroupsId(content.productGroupsId)
		);
		const contentsProducts = await Promise.all(getProducts);

		const contentsWithProducts = contents.map((content, i) => ({
			...content,
			products: contentsProducts[i].success ? contentsProducts[i].data : []
		}));
		return {
			success: true,
			message: '매거진을 불러왔습니다.',
			data: contentsWithProducts
		};
	} catch (error) {
		throw new HTTPError(`${error}`);
	}
};
