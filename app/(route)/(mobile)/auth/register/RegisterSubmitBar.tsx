'use client';

import { useEffect, useState } from 'react';
import { useFormStore } from '../../../../components/common/Form/useForm';
import { SubmitBar } from '@/app/components/global/AppBar';

export default function RegisterSubmitBar() {
	const [isEnabled, setIsEnabled] = useState(false);
	const validateResult = useFormStore(state => state.validateResult);

	useEffect(() => {
		const result = !Object.values(validateResult).includes(false);
		setIsEnabled(result);
	}, [validateResult]);

	return <SubmitBar label="가입하기" disabled={!isEnabled} />;
}
