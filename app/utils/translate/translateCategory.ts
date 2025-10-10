const categoryMap = {
	여성: 'woman',
	woman: '여성',
	남성: 'man',
	man: '남성',
	옷: 'clothes',
	clothes: '옷',
	gender: '성별',
	main: '분류',
	part: '파츠',
	color: '컬러',
	type: '종류',
	size: '사이즈',
	name: '유형'
} as const;

type CategoryKey = keyof typeof categoryMap;

export const translateCategory = (category: string): string | undefined => {
	return categoryMap[category as CategoryKey];
};
