'use client';

import { IconShare } from '../../../../components/common/Icon';
import { AppBar } from '../../../../components/common/AppBar';
import { IconButton } from '../../../../components/common/IconButton';
import { BottomSheet } from '@/app/components/common/BottomSheet';
import { Button } from '@/app/components/common/Button';
import { useState } from 'react';
import { useSystemAlertStore } from '@/app/store';
import { ProductNested } from '@/app/types';
import { Select } from '@/app/components/common/Select';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { formDataToObject } from '@/app/utils';
import { addCart } from '@/app/services/cart';
import isEqual from 'lodash/isEqual';
import { WishButton } from '@/app/components/wish';
import styles from './details.module.scss';
import { BottomSheetState } from '@/app/components/common/BottomSheet/BottomSheet';
import { useOptionFilter } from '@/app/hooks/product/useOptionFilter';

interface PurchaseAppBarProps {
	product: ProductNested;
}

function Purchase({ product }: PurchaseAppBarProps) {
	const [bottomSheetState, setBottomSheetState] = useState<BottomSheetState>('closed');
	const alertPush = useSystemAlertStore(state => state.push);

	const options = product.items.map(item => ({
		...item.option,
		stock: String(item.stock)
	}));
	const { optionKeys, handleOption, filteredOptions } = useOptionFilter(options);

	const queryClient = useQueryClient();
	const cartMutation = useMutation({
		mutationFn: addCart,
		onSuccess: result => {
			queryClient.invalidateQueries({ queryKey: ['cart'] });
			if (result.message) alertPush(result.message);
		}
	});

	const submitOption = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const formDataObject = formDataToObject<object>(formData);
		const matchedItemId = product.items.find(item =>
			isEqual(item.option, formDataObject)
		)?._id;

		if (!matchedItemId) {
			alertPush('상품을 찾을 수 없습니다.');
			return;
		}

		cartMutation.mutate(matchedItemId);
	};

	const handleShare = () => {
		if (navigator.share) {
			navigator.share({
				title: product.name,
				text: product.brand,
				url: window.location.href
			});
		}
	};

	return (
		<div className={styles.purchase}>
			<AppBar className={styles.purchaseAppBar}>
				<div className={styles.container}>
					<div className={styles.buttonWrap}>
						<WishButton
							targetId={product.items[0]._id}
							className={styles.buttonAddLike}
							size="lg"
							name="product"
						/>
						<IconButton size="lg" className={styles.buttonShare} onClick={handleShare}>
							<IconShare />
						</IconButton>
					</div>
					<button
						className={styles.buttonPurchase}
						onClick={() => {
							setBottomSheetState('expanded');
						}}>
						구매하기
					</button>
				</div>
			</AppBar>

			<BottomSheet
				className={styles.purchaseSelectSheet}
				state={bottomSheetState}
				onChange={state => setBottomSheetState(state)}>
				<form onSubmit={submitOption}>
					<ul className={styles.selectWrap}>
						{optionKeys.map(key => (
							<li key={key}>
								<Select
									fill
									size="lg"
									name={key}
									onChange={value => handleOption(key, value)}>
									<Select.Input label={key} />
									<Select.Container direction="top">
										{(filteredOptions?.[key]).map(({ value, stock }) => (
											<Select.Option
												value={value}
												disable={Number(stock) == 0}
												key={value}>
												{value}
												{Number(stock) <= 10 && (
													<span className={styles.stock}>(재고 {stock}개)</span>
												)}
											</Select.Option>
										))}
									</Select.Container>
								</Select>
							</li>
						))}
					</ul>
					<div className={styles.btnWrap}>
						<Button
							className={styles.btnAddCart}
							type="submit"
							size="lg"
							variant="outlined">
							장바구니 담기
						</Button>
						<Button
							className={styles.btnBuy}
							size="lg"
							onClick={() => setBottomSheetState('closed')}>
							바로 구매하기
						</Button>
					</div>
				</form>
			</BottomSheet>
		</div>
	);
}

export default Purchase;
