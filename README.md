# 스타일샵

## 목차

1. [Overview](#overview)
   - [intro](#intro)
   - [Tool & Language](#tool--language)
     - [Tool](#tool)
     - [Language](#language)
     - [Framework](#framework)
     - [Library](#library)
   - [Features](#features)
2. [개발](#개발)
   - [사이트맵](#사이트맵)
   - [폴더구조](#폴더구조)
   - [이름](#이름)
   - [타이포그래피](#타이포그래피)
   - [CSS](#css)
   - [라우트](#라우트)
   - [data fetching 전략](#data-fetching-전략)
     - [응답 객체 및 커스텀 에러](#응답-객체-및-커스텀-에러)
     - [예외 에러](#예외-에러)
     - [서버에서](#서버에서)
     - [클라이언트에서](#클라이언트에서)
3. [프로젝트 수행 기록](#프로젝트-수행-기록)
   - [데이터 스키마](#데이터-스키마)
   - [응답](#응답)
   - [서버 컴포넌트](#서버-컴포넌트)
   - [서버환경](#서버환경)
   - [API & server action](#api--server-action)

# Overview

## intro

- Project name : STYLE
- Contribution : 100%

## Tool & Language

### Tool

- figma
- photoshop
- illustrator
- visual code

### Language

- html, css, sass(scss), javascript, typescript

### Framework

- next.js@15.4.6
- react@19.0.0

### Library

- State : zustand, react context
- Code : eslint, prettier, stylelint
- Auth: next-auth@5.0.0-beta.25, bcrypt
- DB : mongodb, aws-sdk
- UI : swiper, svgr, react-transition-group, @tanstack/react-table
- form: react-hook-form, zod
- fetch: @tanstack/react-query, react-error-boundary
- util: immer, lodash, http-status, nodemailer, react-daum-postcode

## Features

- 웹앱 : PWA 웹앱으로 빠르고 편리한 사용(next-pwa, web-push)
  - OS별(window, android, iOS) 앱 설치 유도 메시지
  - ios-safe-area 대응 풀스크린으로 쾌적한 사용
  - 서비스워커로 정적파일을 캐싱하여 속도 향상 및 이벤트 푸시알림
- 인증 : 멤버십 서비스
  - JWT&OAuth 인증 방식으로 타 서비스와 연동하여 편리한 로그인 및 회원가입(next-auth)
  - 비밀번호 암호화 관리(bcrypt)
  - 로그인이 필요한 경로 보호(middleware)
- 서비스
  - 다크모드 : 텍스트부터 아이콘까지 손쉬운 스타일 관리(SCSS, svgr), 쿠키값을 사용하여 레이아웃 시프트 방지
  - 포스트 : 리뷰 작성 및 수정, 댓글, 이미지 업로드 (mongoDB, aws-sdk)
  - 쇼핑 : 상품 상세, 위시리스트 및 장바구니 관리, 최근 본 상품(회원/비회원), 주문 및 배송지 관리(react-daum-postcode)
  - 검색 : 키워드 기준으로 검색어 denormalize, 최근 검색어(회원/비회원), 상품 필터(홈 카테고리, 트렌드, 맞춤 스타일, 상품 검색), 정렬(최신순, 인기순(기간별 조회), 가격순, 좋아요순), 더보기 무한 쿼리
  - 콘텐츠 : 매거진 및 브랜드 콘텐츠 관리, 이미지 갤러리
- 개발 : 체계적인 프로젝트 구조로 유지보수 용이
  - 코드 관리(prettier, stylelint, eslint, typescript)
  - 데이터 패칭
    - 일관된 데이터 패칭 전략 사용(react-query)
    - 대기 및 에러 핸들링으로 사용자 경험 확보(suspense, react-error-boundary)
  - 추상화된 합성 컴포넌트와 비즈니스 로직이 있는 도메인 컴포넌트로 나누어 유연한 컴포넌트 관리
  - 컴포넌트 상태를 controlled, uncontrolled로 나누어 유연한 상태관리
  - 폴더&파일의 네이밍 및 역할에 따른 배치

# 개발

## 사이트맵

### 모바일

```
## 모바일 앱 (/)
├── /home/[[...category]] (홈 - 카테고리별)
├── /auth (인증)
│   ├── /login (로그인)
│   ├── /register (회원가입)
│   ├── /complete-profile (프로필 완성)
│   └── /find/[tab] (계정/비밀번호 찾기)
│       ├── /@id (아이디 찾기 슬롯)
│       └── /@password (비밀번호 찾기 슬롯)
├── /brand
│   └── /[id] (브랜드 상세)
├── /cart (장바구니)
├── /details/[...route] (상품 상세)
├── /explorer (탐색)
│   ├── /menu (메뉴)
│   │   ├── /@category (카테고리 슬롯)
│   │   └── /@quick (빠른 메뉴 슬롯)
│   └── /result (검색 결과)
│       ├── /content (콘텐츠 검색 결과)
│       └── /product (상품 검색 결과)
├── /feed (피드)
├── /my (마이 페이지)
├── /wish (위시리스트)
│   ├── /@brand (브랜드 위시리스트 슬롯)
│   └── /@product (상품 위시리스트 슬롯)
├── /order (주문)
│   ├── /detail/[orderId] (주문 상세)
│   └── /process (주문 처리)
│       ├── /[orderId] (주문 처리)
│       └── /address (배송 주소)
├── /review (리뷰)
│   ├── /details/[postId] (리뷰 상세)
│   └── /edit/[id] (리뷰 작성/편집)
└── /user (사용자)
    ├── / (사용자 메인)
    ├── /address (배송지 관리)
    │   └── /edit/[[...id]] (배송지 편집)
    ├── /order (주문내역)
    ├── /personalInfo (개인정보)
    └── /style (스타일 설정)
```

### PC (관리자)

```
/admin
├── / (대시보드)
├── /product (상품 관리)
│   ├── / (상품 목록)
│   └── /edit/[id] (상품 편집)
├── /brand (브랜드 관리)
│   ├── / (브랜드 목록)
│   └── /edit/[id] (브랜드 편집)
├── /content (콘텐츠 관리)
│   ├── / (콘텐츠 목록)
│   ├── /edit/[id] (콘텐츠 편집)
│   └── /magazine (매거진 관리)
│       ├── / (매거진 목록)
│       └── /edit/[id] (매거진 편집)
└── /review (리뷰 관리)
    ├── / (리뷰 목록)
    └── /edit/[id] (리뷰 편집)
```

## 폴더구조

- root
  - app
    - (route) : 라우팅
      - (mobile) : 모바일 레이아웃
        - 페이지, 레이아웃, 로딩, 에러 등 next.js 지원 라우팅 파일
        - 컨테이너 : 해당 라우트에서만 사용되는 여러 조각으로 나눈 비즈니스 로직
        - 해당 라우트에서만 사용하는 컴포넌트, 스타일
      - (desktop) : 데스크톱 레이아웃 (관리자)
    - actions : 서버 액션
    - api : next.js 서버 라우트 핸들러
    - components
      - common : UI를 표시하는데 목적이 있는 추상화된 공통 합성 컴포넌트
      - 도메인 컴포넌트 : 특정 도메인의 여러곳에 사용할 수 있는 비즈니스 로직이 포함된 컴포넌트
        - admin, auth, brand, cart, explorer, global, order, post, product, review, system, user, wish
      - 해당 컴포넌트에서만 사용하는 스타일, util function, store, hook
    - constants : 상수 값
    - hooks : 리액트 훅
    - lib : 라이브러리 설정 (next-auth, mongodb, react-query 등)
    - providers : React 프로바이더 (QueryClientProvider, ThemeProvider 등)
    - services : fetch(공통, 도메인)
    - store : 전역상태 값
    - types : 타입스크립트 타입
    - utils : 함수
  - public : 에셋
    - fonts : 폰트
    - icons : 아이콘
    - images : 이미지
    - styles : 스타일
      - abstracts : 전역 변수, 믹스인 등
      - base : 전역 스타일
      - utils : 용도별 스타일

## 이름

- 컴포넌트명 : PascalCase
- 컴포넌트가 포함된 폴더명 : PascalCase
- 변수, 함수, 훅 : camelCase
- 아이디, 클래스명 : camelCase
- 에셋 : snake_case
- 아이콘 : icon*아이콘명*바리에이션\_컬러
- 타입명 : PascalCase

## 타이포그래피

| h1  | 로고     |
| --- | -------- |
| h2  | 페이지명 |
| h3  | 섹션명   |
| h4  | 아티클명 |
| h5  | 상품명   |
| h6  | 기타     |

## CSS

- z-index

아래 요소 이외는 50 이하

| type           | z-index |
| -------------- | ------- |
| Alert, Tooltip | 90      |
| Sheet          | 80      |
| AppBar, NavBar | 60      |
| FAB            | 50      |

## 라우트

- 레이아웃
  - 구성요소 : NavBar, Footer, 하위 페이지에 공통으로 적용되는 컴포넌트

  ```tsx
  export default function Layout({ children }: { children: React.ReactNode }) {
  	return (
  		<div className={styles.layoutName}>
  			<main>{children}</main>
  		</div>
  	);
  }
  ```

- 페이지
  - 주요 컨텐츠

```tsx
export default function Page() {
	<div className={styles.pageName}></div>;
}
```

## data fetching 전략

- 데이터 패칭에 있어 일관된 방법을 사용하여 유지보수를 용이하게 함.
- 로딩, 에러에 유연하게 대응함으로써 사용자 경험 확보

### 응답 객체 및 커스텀 에러

- 일관된 응답 객체를 반환하여 상황에 따라 핸들링한다.
- success : 예외 에러(exception error)가 아닌, 예상 가능한 에러와 구분하기 위해 사용한다.
- 비즈니스 에러는 {success:false…}를 전달하여 핸들링한다.

```tsx
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
```

### 예외 에러

- 예외 에러는 커스텀 에러를 던진다. 타입스크립트에서 에러의 명확한 객체 타입을 받아 커스텀 메세지를 넣는 등, 안정적인 타입으로 사용할 수 있다. `throw new HTTPError`, `e instanceof HTTPError`
- 상위 스택(react-query, handleFetch, react-error-boundary)에서 에러를 캐치하여 적절하게 핸들링한다. 타입스크립트에서 에러의 명확한 객체 타입을 받아 안정적으로 사용할 수 있다.
- 에러를 무조건 숨기는 것이 아닌, 그에 대응하는 메세지 및 화면을 노출하여 유연한 사용자 경험을 확보하고 빠르게 캐치하여 유지보수 할 수 있다.

```tsx
export class HTTPError extends Error {
	status: number;
	timestamp: string;
	path: string | undefined;

	constructor(status: number, message: string, path?: string) {
		super(message); // 반드시 호출해야함
		this.name = `HTTPError`;
		this.status = status;
		this.timestamp = new Date().toISOString();
		this.path = path;
	}

	log() {
		console.error(this);
	}

	showAlert() {
		alert(this.message);
	}
}
```

### 서버에서

- 페이지 & 컴포넌트 : 정상 데이터와 에러를 각각 튜플 타입으로 반환받아 핸들링한다.
- 서버 컴포넌트
  - 페이지 : next.js에서 기본적으로 지원하는 loading route를 사용한다.
  - 컨테이너 : Suspense를 사용하여 데이터를 여러 조각으로 나눠 적절한 로딩 화면을 표시한다.

```tsx
// 튜플로 반환 : [data, null] or [null, error]
const handleFetch = async <R>({
	queryFn,
	isConsole = true
}: {
	queryFn: Promise<R>;
	isConsole?: boolean;
}): Promise<FetchResponse<R>> => {
	try {
		const result = await queryFn;

		return [result, null];
	} catch (e) {
		if (isConsole) console.error(e);
		return [null, e as HTTPError];
	}
};
```

```tsx
export default function Page() {
	return (
		<Suspense>
			<ServerComponent />
		</Suspense>
	);
}

export default function ServerComponent() {
	const fetchData = async () => {
		const response = await fetch('url');
		const result = await response.json();

		if (!response.ok) throw new HTTPError();
		return result;
	};

	const [data, error] = await handleFetch({
		queryFn: fetchData()
	});

	if (error) return; // 에러일 때 로직
	// 정상 로직
}
```

- api route handler
  - 상황에 따라 적절한 http status code로 반환한다.

```tsx
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		// ... 로직
		// 예상되는 에러 반환
		if (checkPw)
			return NextResponse.json(
				{ success: false, message: '비밀번호가 일치하지 않습니다.' },
				{ status: 400 }
			);

		return NextResponse.json({ success: true, message: '' }, { status: 200 }); // 정상 데이터 반환
	} catch (error) {
		// 예외 에러 반환
		return NextResponse.json({ success: false, message: `${err}` }, { status: 500 });
	}
}
```

- server action

```jsx
export async function action(
	_prev: { success: boolean; message: string; },
	formData: FormData
	) {
	try {
		//...
		return { success: true, message: '성공' };
	} catch (error) {
		return { success: false, message: '실패' };
	}
}
```

### 클라이언트에서

- 전송해야할 데이터가 있다면, GET은 query string으로 전달, 그 외에는 body에 담아 전달한다.
- 초기 데이터를 가져올 때
  - 가급적 react-query의 useSuspenseQuery를 사용하여 패칭 상태(로딩, 에러)를 외부에 위임한다.
  - 로딩은 Suspense, 에러는 react-error-boundary를 사용하여, 대체 UI를 표시한다.

```tsx
export default function Page() {
	return (
		<ErrorBoundary>
			<Suspense>
				<ClientComponent />
			</Suspense>
		</ErrorBoundary>
	);
}
```

```tsx
export default function ClientComponent() {
	const fetchData = async () => {
		const response = await fetch('url');
		const result = await response.json();

		if (!response.ok) throw new HTTPError();
		return result;
	};

	const { data } = useSuspenseQuery({
		queryFn: fetchData
		//...
	});
}
```

```tsx
export default function ClientComponent() {
	const fetchData = async () => {
		const response = await fetch('url');
		const result = await response.json();

		if (!response.ok) throw new HTTPError();
		return result;
	};

	const { data, isPending, error } = useQuery({
		queryFn: fetchData
		//...
	});

	if (isPending) return; // 데이터를 가져올 때 로직
	if (error) return; // 에러일 때 로직

	// 정상 로직
}
```

# 프로젝트 수행 기록

### 데이터 스키마

데이터 중복을 피하고자 하나의 productGroup 데이터에 여러개의 productItem을 연결하여 사용하였는데, 매번 상품 데이터를 조회할 때 마다 다른 콜렉션에 조인(lookup)이 필요하여 시간이 많이 소요되는 문제가 있습니다. 데이터가 다소 중복되더라도 보다 효과적인 방법을 찾을 필요가 있어보입니다.

결국 검색 기능을 구현하면서 여러 item을 묶는 group에 keywords 배열을 만들어 각 item의 속성(컬러, 사이즈, 카테고리, 옵션 등)을 입력하고, 이를 mongo db가 색인하도록 하여 검색 속도를 향상시킬 수 있었습니다.

### 응답

응답 객체를 `{success:boolean; message:string; data:T}`로 일관되게 사용하면서, 에러 핸들링을 명확하고 유연하게 하고자 예상 가능한 비즈니스 에러를 success 값으로 구분하고, 예외적인 에러는 던지는(throw) 등, 각 case에 따라 분리하여 대응했습니다. status 200 응답에서도 정상 데이터와 비즈니스 에러로 분기가 나뉘면서, 이를 여러개의 조건문으로 처리해야하는 과정이 번거로웠습니다. 특히 react-query의 경우, data를 바로 반환하고, isError, isPending, success를 3중으로 체크해야하는 불편함이 있었습니다.

커스텀 에러 status code를 정하고, error 객체 하나에 대하여 HTTP status 상태값에 따라 에러를 핸들링한다면, 에러를 좀 더 직관적으로 깔끔하게 핸들링할 수 있습니다.

### 서버 컴포넌트

리액트에서 관심사를 분리하고자 비즈니스 로직을 최대한 부모 컴포넌트로 옮기고, 자식 컴포넌트에게 전달하는 방법을 사용합니다. 하지만 next.js의 서버환경에선 함수 전달이 불가능하기에 이를 클라이언트 컴포넌트로 한 번 더 감쌀 수 밖에 없었습니다. 결국 서버 컴포넌트를 사용하기 위해 여러개의 클라이언트 컴포넌트를 중첩시켜 props drilling하는 상황이 발생하면서, 서버 컴포넌트의 사용 이유에 대한 고민을 하였습니다.

서버 컴포넌트와 클라이언트 컴포넌트간에 장단점을 명확하게 파악하고, 정적인 영역은 서버 컴포넌트를, 동적인 영역은 클라이언트 컴포넌트로 이를 적재적소에 배치할 필요가 있습니다.

### 서버환경

next.js의 서버 환경에선 함수를 prop으로 전달할 수 없고, use hook을 사용하지 못하거나, window & document 객체, 그리고 이에 따른 localStorage, SessionStorage 등에 접근할 수 없는 등 까다로운 조건이 많습니다. 뿐만 아니라, 서버에서 데이터를 패칭하여 캐싱하더라도 react-query의 캐싱과 별개로 분리되는 점 또한 수많은 고민을 야기했습니다. 서버 컴포넌트는 한국과 같이 동적인 기능이 많은 웹서비스에서 껍데기에만 사용되어 한계지점이 있어보입니다.

### API & server action

next.js의 서버 액션과 API를 함께 사용하면서 장단점을 파악할 수 있었습니다.  
서버 액션은 폼 데이터를 제출할 때만 사용할 수 있으며, fetch 없이 직접 formData를 받아 실행할 수 있고, 타입도 공유되어 편리합니다. 그러나 API와 달리 서버에 추가적인 데이터를 전달하기 어려운 지점이 있습니다. 특히나 리액트의 useActionState과 함께 사용하여 응답에 따라 동적으로 핸들링하려 했지만, 추가적인 데이터를 폼데이터와 함께 전달(bind)하려고 하면 하이드레이션 에러를 발생시키는 등, 간단한 폼제출 기능 이외에 유연하게 사용하기 어려운 지점이 있습니다.

API handler는 fetch 등 반복적인 보일러 플레이트 코드를 필요로 하지만, GET, POST, PUT, DELETE 메서드를 지원하고, URL을 기반으로 로직을 명확하게 짤 수 있습니다. 서버 액션과 달리 응답에 따른 핸들링이 편리하여 복잡한 비즈니스 로직에 대응할 수 있습니다.
