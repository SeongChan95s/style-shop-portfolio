'use client';

import { BottomSheet } from '@/app/components/common/BottomSheet';
import { BottomSheetState } from '@/app/components/common/BottomSheet/BottomSheet';
import { Button } from '@/app/components/common/Button';
import { Select } from '@/app/components/common/Select';
import { useOptionFilter } from '@/app/hooks/product/useOptionFilter';
import { getOrderProducts } from '@/app/services/order/getOrderProducts';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState, useActionState } from 'react';
import { create } from 'zustand';
import styles from './../../order.module.scss';
import { Counter } from '@/app/components/common/Counter';
import {
	changeOptionAction,
	ChangeOptionActionState
} from '@/app/actions/order/changeOptionAction';
import { getOrder } from '@/app/services/order/getOrder';

interface UseOptionSheetStore {
	state: BottomSheetState;
	setState: (value: BottomSheetState) => void;
	productGroupId?: string;
	setProductGroupId: (value: string) => void;
}

export const useOptionSheetStore = create<UseOptionSheetStore>(set => ({
	state: 'closed',
	setState: state => {
		set({ state });
	},
	productGroupId: undefined,
	setProductGroupId: state => {
		set({ productGroupId: state });
	}
}));

interface OptionSheetProps {
	orderId: string;
}

export default function OptionSheet({ orderId }: OptionSheetProps) {
	const state = useOptionSheetStore(state => state.state);
	const setState = useOptionSheetStore(state => state.setState);
	const productGroupId = useOptionSheetStore(state => state.productGroupId);
	const [options, setOptions] = useState<
		Array<{ [key: string]: string } & { stock: string }>
	>([]);

	const { data: getOrderResult } = useQuery({
		queryFn: () => getOrder(orderId),
		queryKey: ['order', orderId]
	});

	const { data, isError, isPending } = useQuery({
		queryFn: async () => await getOrderProducts(orderId),
		queryKey: ['order', 'product', orderId]
	});
	const targetProduct = data?.data?.find(el => el._id === productGroupId);

	const queryClient = useQueryClient();
	const initialState: ChangeOptionActionState = { success: false, message: '' };
	const [actionState, formAction] = useActionState(changeOptionAction, initialState);

	useEffect(() => {
		if (data?.success) {
			if (targetProduct) {
				const options =
					targetProduct.items.map(item => ({
						...item.option,
						stock: String(item.stock)
					})) || [];
				setOptions(options);
			}
		}
	}, [targetProduct?.items[0]?._id]);

	const { optionKeys, handleOption, filteredOptions } = useOptionFilter(options);

	useEffect(() => {
		if (actionState.success) {
			queryClient.invalidateQueries({ queryKey: ['order'] });
			setState('closed');
		}
	}, [actionState]);

	if (isError || isPending || !data.success) return <></>;

	return (
		<BottomSheet
			className={styles.optionSheet}
			state={state}
			onChange={state => setState(state)}>
			<form action={formAction}>
				{getOrderResult && getOrderResult.success && (
					<>
						<input
							type="hidden"
							name="orderData"
							value={JSON.stringify(getOrderResult.data)}
						/>
						<input
							type="hidden"
							name="orderProductsData"
							value={JSON.stringify(data.data)}
						/>
						<input
							type="hidden"
							name="targetProduct"
							value={JSON.stringify(targetProduct)}
						/>
					</>
				)}

				<ul>
					{optionKeys.map(key => (
						<li key={key}>
							<Select
								fill
								size="lg"
								name={key}
								onChange={value => handleOption(key, value)}>
								<Select.Input label={key} />
								<Select.Container direction="top">
									{(filteredOptions[key] || []).map(({ value, stock }) => (
										<Select.Option value={value} disable={Number(stock) == 0} key={value}>
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

				<Counter className={styles.counter} name="count">
					<Counter.Increase>+</Counter.Increase>
					<Counter.Count />
					<Counter.Decrease>-</Counter.Decrease>
				</Counter>
				<Button className={styles.changeButton} size="lg" type="submit" fill>
					변경하기
				</Button>
				{actionState.message && (
					<p
						className={actionState.success ? styles.successMessage : styles.errorMessage}>
						{actionState.message}
					</p>
				)}
			</form>
		</BottomSheet>
	);
}
