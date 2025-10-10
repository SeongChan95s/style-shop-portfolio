'use client';

import RadioButton from '@/app/components/common/RadioButton/RadioButton';
import styles from './../../order.module.scss';

export default function Payment() {
	return (
		<section className={`sectionLayoutLg ${styles.payment}`}>
			<div className="inner">
				<header className="headerLayoutMd">
					<h3>결제 수단</h3>
				</header>

				<ul className={styles.method}>
					<li>
						<RadioButton
							shape="round"
							className={styles.radioButton}
							name="payment.method"
							value="naverpay">
							네이버페이
						</RadioButton>
					</li>
					<li>
						<RadioButton
							shape="round"
							className={styles.radioButton}
							name="payment.method"
							value="kakaopay">
							카카오페이
						</RadioButton>
					</li>
					<li>
						<RadioButton
							shape="round"
							className={styles.radioButton}
							name="payment.method"
							value="applepay">
							애플페이
						</RadioButton>
					</li>
					<li>
						<ul className={styles.methodDepth02}>
							<li>
								<RadioButton
									variant="outlined"
									className={styles.radioButton}
									name="payment.method"
									value="card"
									fill>
									카드
								</RadioButton>
							</li>
							<li>
								<RadioButton
									variant="outlined"
									className={styles.radioButton}
									name="payment.method"
									value="phone"
									fill>
									휴대폰
								</RadioButton>
							</li>
							<li>
								<RadioButton
									variant="outlined"
									className={styles.radioButton}
									name="payment.method"
									value="account"
									fill>
									가상계좌
								</RadioButton>
							</li>
							<li>
								<RadioButton
									variant="outlined"
									className={styles.radioButton}
									name="payment.method"
									value="easy"
									fill>
									간편결제
								</RadioButton>
							</li>
						</ul>
					</li>
				</ul>
			</div>
		</section>
	);
}
