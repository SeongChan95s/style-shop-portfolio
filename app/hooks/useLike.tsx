import { useState } from 'react';

export default function useLike() {
	const [like, setLike] = useState('');

	function addLike() {
		setLike(state => {
			return state === '' ? ' active' : '';
		});
	}

	return [like, addLike];
}
