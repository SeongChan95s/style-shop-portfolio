export const getRedundancy = (arrayA: string[], arrayB: string[]): number => {
	return arrayA.filter(item => arrayB.includes(item)).length;
};
