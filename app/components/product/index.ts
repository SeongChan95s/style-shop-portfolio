import { default as ProductCardMain } from './ProductCard';
import ProductCardSkeleton from './ProductCard.skeleton';

export { ColorPicker } from './ColorPicker';

export const ProductCard = Object.assign(ProductCardMain, {
	Skeleton: ProductCardSkeleton
});
