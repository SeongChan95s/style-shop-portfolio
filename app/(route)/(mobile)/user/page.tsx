import { getSession } from '@/app/actions/auth/authActions';
import { redirect } from 'next/navigation';

export default async function UserPage() {
	const session = await getSession();
	if (!session) return redirect('/');

	return <div className="page">유저 페이지 입니다.</div>;
}
