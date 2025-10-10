import { NavLink } from '@/app/components/common/Link';
import styles from './result.module.scss';

interface CategoryProps {
	search: string;
}

export default function CategoryMenu({ search }: CategoryProps) {
	return (
		<nav className={styles.categoryMenu}>
			<ul>
				<li>
					<NavLink href={`/explorer/result/product?search=${search}`} exact={false}>
						상품
					</NavLink>
				</li>
				<li>
					<NavLink href={`/explorer/result/content?search=${search}`} exact={false}>
						컨텐츠
					</NavLink>
				</li>
			</ul>
		</nav>
	);
}
