export const createView = async (itemId: string) => {
	await fetch(`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/view/createView`, {
		method: 'POST',
		body: JSON.stringify({ itemId })
	});
};
