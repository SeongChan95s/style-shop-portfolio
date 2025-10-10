'use client';

import { Session } from 'next-auth';
import { signIn } from 'next-auth/react';
import styles from './my.module.scss';

export default function Profile({ user }: { user: Session['user'] | undefined }) {
	return (
		<section className={styles.profile}>
			<div className="inner">
				<h3 className="hidden">프로필</h3>
				{user ? (
					<div className={styles.userScreen}>
						<div className={styles.profileCard}>
							<div className={styles.thumbnail}>
								{user?.name?.charAt(0).toUpperCase()}
							</div>
							<p className={styles.user}>
								<span className={styles.name}>{user.name}</span> 님
							</p>
						</div>
						<ul className={styles.userSummaryInfo}>
							<li>LV.5 실버</li>
							<li>
								<span className={styles.label}>쿠폰</span>
								<span>116</span> 장
							</li>
							<li>
								<span className={styles.label}>적립금</span>
								<span>3,420</span> 원
							</li>
						</ul>
					</div>
				) : (
					<div className={styles.guestScreen}>
						<button className={styles.loginButton} onClick={() => signIn()}>
							로그인이
							<br /> 필요합니다.
						</button>
					</div>
				)}
			</div>
		</section>
	);
}
