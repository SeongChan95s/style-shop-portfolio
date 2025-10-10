'use server';

import { redirect } from 'next/navigation';

export const purchaseAction = async (formData: FormData) => {
	console.log(formData);
	// redirect('/');
};
