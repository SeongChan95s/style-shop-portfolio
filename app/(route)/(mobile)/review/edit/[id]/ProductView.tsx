import { handleFetch } from '@/app/utils';
import styles from './reviewEdit.module.scss';
import { getProductNestedByItemId } from '@/app/services/product';
import Image from 'next/image';

interface ProductViewProps {
	productItemId: string;
}

export default async function ProductView({ productItemId }: ProductViewProps) {
	const [data, error] = await handleFetch({
		queryFn: getProductNestedByItemId(productItemId)
	});

	if (error) return <></>;
	const product = data.success ? data.data : null;

	if (!product) return <></>;

	return (
		<section className={styles.productView}>
			<div className="inner">
				<header className="headerLayoutMd">
					<h3>이 상품 어떠셨나요?</h3>
				</header>
				<div className={styles.purchased}>
					<div className={styles.thumbnail}>
						<Image
							src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${product.items[0].images?.[0]}`}
							sizes="20%"
							fill
							alt=""
						/>
					</div>
					<div className={styles.container}>
						<span className={styles.brand}>{product.brand}</span>
						<h5 className={styles.name}>{product.name}</h5>
						<span className={styles.price}>
							<span>{product.items[0].option.color}</span>
							<span>/</span>
							<span>{product.items[0].option.size}</span>
						</span>
					</div>
				</div>
			</div>
		</section>
	);
}
