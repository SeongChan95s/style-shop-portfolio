import { ObjectId } from 'mongodb';
import { HTTPError } from '../services/HTTPError';
import { User } from './next-auth';

export type NestedObject = { [key: string | number]: unknown };

export interface ProductGroup {
	_id: string;
	name: string;
	brand: string;
	price: {
		cost: number;
		discount: number;
	};
	category: { [key: string]: string };
	keywords: string[];
}

export interface ProductItem {
	_id: string;
	groupId: string;
	images?: string[];
	option: {
		size: string;
		color: string;
	};
	stock: string;
	view?: number;
	reviewId?: string;
	hasReview?: boolean;
}

export interface ProductNested extends ProductGroup {
	items: ProductItem[];
	totalView?: number;
}

export interface ProductFlat {
	productGroupId: string;
	productItemId: string;
	name: string;
	brand: string;
	price: {
		cost: number;
		discount: number;
	};
	category: { [key: string]: string };
	images?: string[];
	option: { [key: string]: string };
	stock: string;
	view?: number;
}
export interface Brand {
	_id: string;
	name: {
		main: string;
		sub: string;
	};
	images: string[];
	desc: string;
	country: string;
	since: number;
	wishUsers: string[];
}

export interface Review<T = ObjectId> {
	_id: T;
	content: {
		images: string[];
		text: string;
	};
	score: number;
	author: Omit<User<T>, 'password'>;
	timestamp: string;
	productItemId: T;
	productGroupId: T;
	orderId: T;
	comment: number;
	wishUsers: string[];
	viewUsers: string[];
	productItem?: ProductItem;
}

export interface CommentType {
	_id: ObjectId;
	postId: ObjectId;
	content: string;
	userEmail: string;
	author: Omit<User, 'password'>;
}

export interface Wish<T = ObjectId> {
	_id: T;
	name: string;
	targetId: string;
	userEmail: string;
}

export interface BrandWithProduct {
	_id: string;
	name: {
		main: string;
		sub: string;
	};
	desc: string;
	country: string;
	since: number;
	images: string[];
	wishUsers: string[];
	products: ProductNested[];
}

export interface Cart
	extends Pick<
		ProductFlat,
		'name' | 'productItemId' | 'images' | 'option' | 'category' | 'price' | 'stock'
	> {
	cartId: string;
	count: number;
}

export interface Content {
	_id: ObjectId;
	images: string[];
	name: string;
	title: string;
	body: string;
	url: string;
}

export interface Magazine extends Content {
	productGroupsId: string[];
	keyword: string[];
	products: ProductNested[];
	keywords?: string[];
}

export interface View {
	itemId: string;
	userEmail: string;
	timestmap: string;
}

export interface NavBarPropsType {
	back: boolean;
	logo: boolean;
	search: boolean;
	mainLnb: boolean;
	display?: string;
}

export interface Search {
	_id: string;
	timestamp: number;
	search: string;
}

export type FetchResponse<T = void> = T extends void
	? {
			success: boolean;
			message: string;
		}
	:
			| {
					success: true;
					message: string;
					data: T;
			  }
			| {
					success: false;
					message: string;
			  };

export type HandleFetchResponse<T> = [null, HTTPError] | [T, null];

export interface ProductGroupCollection {
	_id: ObjectId;
	name: string;
	brand: string;
	price: {
		cost: number;
		discount: number;
	};
	category: { [key: string]: string };
	keywords: string[];
}

export interface ProductItemCollection {
	_id: ObjectId;
	groupId: ObjectId;
	images?: string[];
	option: { [key: string]: string };
	stock: number;
	view?: number;
}

export interface CartCollection {
	_id: ObjectId;
	itemId: ObjectId;
	userEmail: string;
	count: number;
}
export interface ReviewsCollection {
	_id: ObjectId;
	productGroupId: ObjectId;
	productItemId: ObjectId;
	orderId: ObjectId;
	content: {
		images: string[];
		text: string;
	};
	userEmail: string;
	score: number;
	timestamp: number;
}
export interface User<T = ObjectId> {
	_id: T;
	email: string;
	password: string;
	name: string;
	role: string;
	gender?: string;
	height?: string;
	weight?: string;
	address?: ObjectId[];
}
export interface CartsCollection {
	_id: string;
	count: number;
	productItemId: ObjectId;
}
export interface SearchCollection {
	_id: ObjectId;
	timestamp: number;
	userEmail: ObjectId;
	search: string;
}

export type Post = {
	code: string;
	road: string;
	detail?: string;
};
export type Address<I = ObjectId> = {
	_id: I;
	name: string;
	tel: string;
	post: Post;
	default: boolean;
};

export interface BrandCollection {
	_id: ObjectId;
	name: {
		main: string;
		sub: string;
	};
	images: string[];
	desc: string;
	country: string;
	since: number;
	wishUsers: string[];
}

export interface Order<T = ObjectId> {
	_id: T;
	userEmail: string;
	address?: Omit<Address<T>> & {
		request?: string;
	};
	products: {
		productItemId: T;
		count: number;
	}[];
	payment?: {
		method: string;
		price: number;
		discount: number;
		total: number;
	};
	status:
		| 'order-progress' // 주문서 작성중
		| 'receive' // 주문접수
		| 'shipped' // 배송중
		| 'completed' // 배송완료
		| 'return-request' // 반품요청
		| 'return-processing' // 반품중
		| 'return-completed' // 반품완료
		| 'confirmed'; // 구매확정
	timestamp: number;
}

export interface OrderProducts<T = ObjectId> extends Order {
	products: {
		_id: T;
		count: number;
		items: ProductItem[];
		totalView?: number;
		name: string;
		brand: string;
		price: {
			cost: number;
			discount: number;
		};
		category: {
			[key: string]: string;
		};
		keywords: string[];
	}[];
}

export interface CategoryTypeInPart<T = ObjectId> {
	_id: T;
	type: string;
	image: string;
	name: string;
	part: string;
	main: string;
}
