'use client';

import Image from 'next/image';
import { Card } from '../common/Card';
import { Cart } from '@/app/types';
import { IconClose, IconDecrease, IconIncrease } from '../common/Icon';
import { Dispatch, memo, SetStateAction, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useSystemAlertStore } from '@/app/store';
import { Checkbox } from '../common/Checkbox';
import { IconButton } from '../common/IconButton';
import { addCart, deleteCartById, removeCart } from '@/app/services/cart';
import { useCartStore } from '@/app/(route)/(mobile)/cart/cart.store';
import { Counter } from '../common/Counter';
import styles from './CartCard.module.scss';

interface CartCheckboxProps {
	cartId: string;
}

function CartCheckbox({ cartId }: CartCheckboxProps) {
	const [checked, setChecked] = useState(false);
	const carts = useCartStore(state => state.carts);
	const checkCart = useCartStore(state => state.checkCart);
	const unCheckCart = useCartStore(state => state.unCheckCart);
	const handleChangeChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) {
			checkCart(e.target.value);
			setChecked(true);
		} else {
			unCheckCart(e.target.value);
			setChecked(false);
		}
	};
	useEffect(() => {
		const cart = carts.find(cart => cart.cartId === cartId);
		if (cart?.checked) {
			setChecked(true);
		} else {
			setChecked(false);
		}
	}, [carts]);

	return (
		<Checkbox
			name={cartId}
			value={cartId}
			checked={checked}
			onInput={handleChangeChecked}
			onChange={handleChangeChecked}
		/>
	);
}

interface CartCounterProps {
	className?: string;
	cartId: string;
	productId: string;
	option: { size?: string; color?: string };
	count: number;
	setCount: (value: number) => void;
	setIsVisible: Dispatch<SetStateAction<boolean>>;
}

function CartCounter({
	className,
	cartId,
	productId,
	option,
	count,
	setCount,
	setIsVisible
}: CartCounterProps) {
	const handleCartCount = async (target: {
		productId: string;
		option: { size?: string; color?: string };
		method: string;
	}) => {
		if (target.method == 'increase') return addCart(productId);
		if (target.method == 'decrease') return removeCart(productId);
	};

	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: handleCartCount,
		onSuccess: response => {
			queryClient.invalidateQueries({ queryKey: ['carts'] });
			if (response?.message == '장바구니에서 상품을 삭제했습니다.') {
				setIsVisible(false);
			}
		}
	});

	const setCheckedCart = useCartStore(cart => cart.setCheckedCart);

	const handleDecrease = () => {
		setCheckedCart({ cartId, count: count - 1 });
		mutation.mutate({ productId, option, method: 'decrease' });
	};
	const handleIncrease = () => {
		setCheckedCart({ cartId, count: count + 1 });
		mutation.mutate({ productId, option, method: 'increase' });
	};

	return (
		<>
			<Counter
				value={count}
				className={`${className}`}
				onChange={count => {
					setCount(count);
				}}>
				<Counter.Decrease onClick={handleDecrease}>
					<IconDecrease />
				</Counter.Decrease>
				<Counter.Count />
				<Counter.Increase onClick={handleIncrease}>
					<IconIncrease />
				</Counter.Increase>
			</Counter>
		</>
	);
}

interface CartCardProps {
	cart: Cart;
}

function CartCard({ cart }: CartCardProps) {
	const option = cart.option;
	const optionValues = Object.values(option).join(' / ');
	const [isVisible, setIsVisible] = useState(true);
	const deleteCartState = useCartStore(state => state.deleteCart);
	const [count, setCount] = useState(cart.count);

	const pushAlert = useSystemAlertStore(state => state.push);
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: deleteCartById,
		onSuccess: () => {
			setIsVisible(false);
			queryClient.invalidateQueries({ queryKey: ['cart-count'] });
			deleteCartState(cart);
		},
		onError: e => {
			pushAlert(e.message);
		}
	});

	const discountedPrice = Math.floor(
		cart.price.cost -
		(cart.price.cost * cart.price.discount) / 100
	).toLocaleString();
	const originalPrice = Math.floor(cart.price.cost).toLocaleString();

	if (!isVisible) return <></>;

	return (
		<Card className={`cart-card ${styles.card}`} direction="horizontal">
			<div className={styles.checkArea}>
				<CartCheckbox cartId={cart.cartId} />
			</div>

			<div className={styles.container}>
				<Link
					href={`/details/${cart.category.main}/${cart.productItemId}`}
					className={styles.productInfo}>
					<Card.Thumbnail className={styles.thumbnail}>
						<Image
							src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${cart.images?.[0]}`}
							alt={cart.name}
							sizes="20vw"
							fill={true}
						/>
					</Card.Thumbnail>

					<Card.Container className={styles.cardBody}>
						<div className={styles.titleWrap}>
							<h5 className={styles.name}>{cart.name}</h5>

							<p className={styles.optionWrap}>{optionValues}</p>
						</div>

						<IconButton
							className={styles.deleteButton}
							size="sm"
							onClick={e => {
								e.preventDefault();
								mutation.mutate(cart.cartId);
							}}>
							<IconClose size="sm" color="var(--black-color-dim)" />
						</IconButton>
					</Card.Container>
				</Link>

				<div className={styles.cardFooter}>
					<CartCounter
						cartId={cart.cartId}
						count={count}
						setCount={setCount}
						productId={cart.productItemId}
						option={cart.option}
						setIsVisible={setIsVisible}
						className={styles.counter}
					/>
					<div className={styles.price}>
						{originalPrice != discountedPrice && (
							<span className={styles.originalPrice}>{originalPrice}</span>
						)}
						<span className={styles.discountedPrice}>{discountedPrice}원</span>
					</div>
				</div>
			</div>
		</Card>
	);
}

export default memo(CartCard);
