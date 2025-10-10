'use client';

import { useFormStore } from '@/app/components/common/Form/useForm';
import { SubmitBar } from '@/app/components/global/AppBar';

export default function SubmitForm() {
	const validateResult = useFormStore(state => state.validateResult);
	const disabled = Object.values(validateResult).includes(false);

	return <SubmitBar label={<>{'수정하기'}</>} disabled={disabled} />;
}
