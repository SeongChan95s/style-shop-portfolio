export const createTransitionClassNames = (prefix: string = '') => {
	const baseNames = {
		enter: 'enter',
		enterActive: 'enterActive',
		enterDone: 'enterDone',
		exit: 'exit',
		exitActive: 'exitActive',
		exitDone: 'exitDone'
	};

	if (!prefix) {
		return baseNames;
	}

	return {
		enter: `${prefix}Enter`,
		enterActive: `${prefix}EnterActive`,
		enterDone: `${prefix}EnterDone`,
		exit: `${prefix}Exit`,
		exitActive: `${prefix}ExitActive`,
		exitDone: `${prefix}ExitDone`
	};
};
