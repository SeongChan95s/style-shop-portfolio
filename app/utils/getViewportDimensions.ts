export const getViewportDimensions = () => {
	const { innerWidth: width, innerHeight: height } = window;

	return { width, height };
};
