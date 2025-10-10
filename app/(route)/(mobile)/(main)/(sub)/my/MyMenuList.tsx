'use client';

import { IconArrowTrim } from '@/app/components/common/Icon';
import { List } from '@/app/components/common/List';
import { Divider } from '@/app/components/common/Divider';
import { useViewTransition } from '@/app/hooks';
import { useSession } from '@/app/providers';
import styles from './my.module.scss';
import { useSystemAlertStore } from '@/app/store';

export default function MyMenuList() {
	const { handleViewTransition } = useViewTransition();

	const session = useSession();

	const handleNotReadyPage = () => {
		useSystemAlertStore.getState().push('준비되지 않은 페이지 입니다.');
	};

	return (
		<section className={`${styles.myMenuList} sectionLayoutMd`}>
			<div className="inner">
				<h3 className="hidden">나의 메뉴 목록</h3>
				<article>
					<h4 className="hidden">나의 쇼핑</h4>
					<List>
						<List.Item
							as="button"
							onClick={() => handleViewTransition('/user/order', 'next')}>
							주문내역
							<IconArrowTrim />
						</List.Item>
						<List.Item as="button" onClick={handleNotReadyPage}>
							취소/반품/교환 내역
							<IconArrowTrim />
						</List.Item>
						<List.Item as="button" onClick={handleNotReadyPage}>
							최근 본 상품
							<IconArrowTrim />
						</List.Item>
						<List.Item as="button" onClick={handleNotReadyPage}>
							리뷰
							<IconArrowTrim />
						</List.Item>
						<List.Item
							as="button"
							onClick={() => handleViewTransition('/user/style', 'next')}>
							<div>
								맞춤 스타일
								<span className="desc">체형, 성별 정보 입력하고 상품 추천받기</span>
							</div>
							<IconArrowTrim />
						</List.Item>
					</List>
				</article>
				<Divider />
				<article>
					<h4 className="hidden">나의 정보</h4>
					<List>
						<List.Item
							as="button"
							onClick={() => handleViewTransition('/user/personalInfo', 'next')}>
							회원정보
							<IconArrowTrim />
						</List.Item>
						<List.Item as="button" onClick={handleNotReadyPage}>
							멤버십
							<IconArrowTrim />
						</List.Item>
						<List.Item as="button" onClick={handleNotReadyPage}>
							쿠폰
							<IconArrowTrim />
						</List.Item>
						<List.Item as="button" onClick={handleNotReadyPage}>
							마일리지
							<IconArrowTrim />
						</List.Item>
						<List.Item
							as="button"
							onClick={() => handleViewTransition('/user/address', 'next')}>
							배송지 관리
							<IconArrowTrim />
						</List.Item>
					</List>
				</article>
				<Divider />
				<article>
					<h4 className="hidden">기타</h4>
					<List>
						<List.Item as="button" onClick={handleNotReadyPage}>
							고객센터
							<IconArrowTrim />
						</List.Item>
						<List.Item as="button" onClick={handleNotReadyPage}>
							1:1 문의
							<IconArrowTrim />
						</List.Item>
						<List.Item as="button" onClick={handleNotReadyPage}>
							공지사항
							<IconArrowTrim />
						</List.Item>
						<List.Item as="button" onClick={handleNotReadyPage}>
							소개
							<IconArrowTrim />
						</List.Item>
					</List>
				</article>
				{session && (
					<>
						<Divider />
						<article>
							<h4 className="hidden">관리자 메뉴</h4>
							<List>
								<List.Item
									as="button"
									onClick={() => handleViewTransition('/admin', 'next')}>
									관리자
									<IconArrowTrim />
								</List.Item>
								<List.Item
									as="button"
									onClick={() => handleViewTransition('/admin/product', 'next')}>
									상품 관리
									<IconArrowTrim />
								</List.Item>
								<List.Item
									as="button"
									onClick={() => handleViewTransition('/admin/brand', 'next')}>
									브랜드 관리
									<IconArrowTrim />
								</List.Item>
							</List>
						</article>
					</>
				)}
			</div>
		</section>
	);
}
