import { addWish } from './addWish';
import { getUserWishByProduct } from './getUserWishByProduct';
import { getWishProductsBySession } from './getWishesWithProductsByUser';
import { getWishBrandsWithProductBySession } from './getWishBrandsBySession';
import { removeWish } from './removeWish';

export {
	getUserWishByProduct,
	addWish,
	removeWish,
	getWishProductsBySession as getWishesWithProductsByUser,
	getWishBrandsWithProductBySession as getWishesWithBrandsByUser
};
