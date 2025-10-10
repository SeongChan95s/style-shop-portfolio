import styles from './../auth.module.scss';

export default function Greetings() {
	return (
		<section className={styles.greetings}>
			<div className="inner">
				<h2 className={styles.title}>
					STYLE에 <br />
					오신 것을 환영해요!
				</h2>
				<p className={styles.subTitle}>처음이라면, 15% 할인 꼭 받으세요!</p>
			</div>
		</section>
	);
}
