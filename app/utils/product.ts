export const discountedPrice = (cost: number, discount: number) => {
	const result = ~~(cost - cost * (discount / 100));

	return result.toLocaleString();
};
