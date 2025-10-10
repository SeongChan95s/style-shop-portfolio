'use client';

import { useState } from 'react';
import { Accordion } from '../../common/Accordion';
import styles from './Footer.module.scss';
import { Divider } from '../../common/Divider';
import { IconArrowTrim } from '../../common/Icon';

export default function Footer() {
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const accordionData = [
		{
			header: '사업자정보',
			body: '사업자정보 본문'
		},
		{
			header: '법적 고지사항',
			body: '법적 고지사항 본문'
		},
		{
			header: '파트너 지원',
			body: '파트너 지원 본문'
		},
		{
			header: '고객 지원',
			body: '고객 지원 본문'
		}
	];

	return (
		<footer className={styles.footer}>
			<div className="inner">
				<ul className={styles.listMenu}>
					{accordionData.map((data, i) => (
						<li key={i}>
							<Accordion
								open={openIndex === i}
								onChange={() => setOpenIndex(openIndex === i ? null : i)}>
								<Accordion.Header>{data.header}</Accordion.Header>
								<Accordion.Body>{data.body}</Accordion.Body>
							</Accordion>
						</li>
					))}
				</ul>
				<Divider className={styles.divider} color="dark" />

				<h6 className={styles.copr}>ⓒ STYLES ALL RIGHTS RESERVED</h6>
				<ul className={styles.quickLink}>
					<li>개인정보처리방침</li>
					<li>이용약관</li>
					<li>결제대행 위탁사</li>
				</ul>
				<p className={styles.terms}>
					일부 상품의 경우 주식회사 STYLES는 통신판매의 당사자가 아닌 통신판매중개자로서
					상품, 상품정보, 거래에 대한 책임이 제한될 수 있으므로, 각 상품 페이지에서
					구체적인 내용을 확인하시기 바랍니다.
				</p>
			</div>
		</footer>
	);
}
