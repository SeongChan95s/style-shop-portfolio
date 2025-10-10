'use client';

import { create } from 'zustand';
import { BottomSheet } from '../common/BottomSheet';
import DaumPostcodeEmbed, { Address as PostCodeAddress } from 'react-daum-postcode';
import { BottomSheetState } from '../common/BottomSheet/BottomSheet';
import styles from './PostCodeSheet.module.scss';
import { IconButton } from '../common/IconButton';
import { IconClose } from '../common/Icon';
import { Post } from '@/app/types';

interface UsePostCodeSheetStore {
	state: BottomSheetState;
	setState: (state: BottomSheetState) => void;
	address: Post;
	setAddress: (value: Post) => void;
}

export const usePostCodeSheetStore = create<UsePostCodeSheetStore>(set => ({
	state: 'closed',
	setState: state => set({ state }),
	address: {
		road: '',
		code: ''
	},
	setAddress: (address: Post) => set({ address })
}));

interface PostCodeSheetProps {
	onComplete?: (address: PostCodeAddress) => void;
}

export default function PostCodeSheet({ onComplete }: PostCodeSheetProps) {
	const state = usePostCodeSheetStore(state => state.state);
	const setState = usePostCodeSheetStore(state => state.setState);

	const themeObj = {
		bgColor: '#f8f8f8' //바탕 배경색
		//searchBgColor: "", //검색창 배경색
		//contentBgColor: "", //본문 배경색(검색결과,결과없음,첫화면,검색서제스트)
		//pageBgColor: "", //페이지 배경색
		//textColor: "", //기본 글자색
		//queryTextColor: "", //검색창 글자색
		//postcodeTextColor: "", //우편번호 글자색
		//emphTextColor: "", //강조 글자색
		//outlineColor: "", //테두리
	};

	return (
		<BottomSheet
			className={styles.postCodeSheet}
			state={state}
			onChange={state => setState(state)}
			maxHeight="100vh">
			<header>
				<div className="inner">
					<h3>주소 찾기</h3>
					<IconButton onClick={() => setState('closed')}>
						<IconClose />
					</IconButton>
				</div>
			</header>
			<DaumPostcodeEmbed
				className={styles.embed}
				onComplete={data => onComplete?.(data)}
				onClose={() => setState('closed')}
				style={{ height: '100%' }}
				theme={themeObj}
			/>
		</BottomSheet>
	);
}
