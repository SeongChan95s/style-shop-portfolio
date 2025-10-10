import Greetings from './Greetings';
import LoginForm from './LoginForm';
import styles from './../auth.module.scss';

export default function LoginPage() {
	return (
		<div className={`${styles.loginPage}`}>
			<div className={styles.wrap}>
				<Greetings />
				<LoginForm />
			</div>
		</div>
	);
}
