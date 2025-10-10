import Profile from './Profile';
import { getSession } from '@/app/actions/auth/authActions';
import MyMenuList from './MyMenuList';
import styles from './my.module.scss';
import LoginButton from './LoginButton';
import ActiveOrder from './ActiveOrder';

export default async function MyPage() {
	const session = await getSession();

	return (
		<div className={`${styles.myPage}`}>
			<Profile user={session?.user} />
			<ActiveOrder />
			<MyMenuList />

			<footer className={styles.footer}>
				<div className="inner">
					<LoginButton isLogin={session ? true : false} />
				</div>
			</footer>
		</div>
	);
}
