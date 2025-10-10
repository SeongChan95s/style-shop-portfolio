import { FetchResponse, ProductNested, Search } from '@/app/types';
import { HTTPError } from '../HTTPError';
import { getSearchRank } from './getSearchRank';
import { searchProducts } from './searchProducts';

interface params {
	limit?: {
		group?: number;
		item?: number;
	};
}

export const getSearchRankWithProducts = async ({
	limit
}: params): Promise<
	FetchResponse<
		(Search & { state: 'up' | 'none' | 'down' | 'new'; products: ProductNested[] })[]
	>
> => {
	try {
		const getSearchRankResponse = await getSearchRank();

		if (!getSearchRankResponse.success) {
			return { success: false, message: 'Failed to get search rank' };
		}

		const searchArray = getSearchRankResponse.data.map((el: Search) => el.search);
		const searchPromise = searchArray.map((el: string) => searchProducts({ search: el, limit }));
		const searchResponse = await Promise.all(searchPromise);

		const result = searchResponse.map((el: FetchResponse<ProductNested[]>, i: number) => ({
			...getSearchRankResponse.data[i],
			products: el.success ? el.data : []
		}));

		return {
			success: true,
			message: '검색 순위와 상품 목록을 불러왔습니다.',
			data: result
		};
	} catch (error) {
		if (error instanceof HTTPError) throw new HTTPError(error.message, error.status);
		return { success: false, message: (error as Error).message };
	}
};
