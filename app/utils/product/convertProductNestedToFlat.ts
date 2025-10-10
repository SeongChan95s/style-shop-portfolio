import { ProductNested, ProductFlat } from '@/app/types';

export const convertNestedToFlat = (product: ProductNested): ProductFlat[] => {
	return product.items.map(item => ({
		productGroupId: product._id,
		productItemId: item._id,
		name: product.name,
		brand: product.brand,
		price: product.price,
		category: product.category,
		images: item.images,
		option: item.option,
		stock: item.stock,
		view: item.view
	}));
};

export const convertNestedArrayToFlat = (products: ProductNested[]): ProductFlat[] => {
	return products.flatMap(convertNestedToFlat);
};
