import RegisterForm from './RegisterForm';
import styles from './../auth.module.scss';

export default function RegisterPage() {
	return (
		<div className={styles.registerPage}>
			<div className={styles.wrap}>
				<RegisterForm />
			</div>
		</div>
	);
}
