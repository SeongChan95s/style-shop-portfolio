# Style Shop Portfolio

Next.js 15.2.3 기반 패션 E-commerce 플랫폼 (모바일 우선, PWA)

## 기술 스택

- **Frontend**: Next.js 15.2.3, React 19, TypeScript
- **Backend**: MongoDB, Next-Auth 5.0, AWS S3
- **State**: Zustand, TanStack Query
- **Styling**: Sass/SCSS (CSS Modules)

## 프로젝트 구조

```
/app/(route)/(mobile) - 모바일 레이아웃
├── (main)/(sub) - 메인/서브 페이지
├── auth - 인증
├── brand - 브랜드 상세
├── cart - 장바구니
├── details - 상품 상세
└── user - 사용자 설정
/app/(route)/(pc)/admin - 관리자 페이지
/app/api - API 엔드포인트
```

## 주요 기능

- 회원가입/로그인 (이메일/GitHub OAuth)
- 상품 검색/필터링/위시리스트
- 장바구니/리뷰 관리
- 관리자: 상품/브랜드/이미지 관리

## 개발 명령어

```bash
npm run dev    # 개발 서버
npm run build  # 프로덕션 빌드
npm run lint   # ESLint 검사
```

## 코딩 규칙

### 재사용 우선 원칙

- **기존 컴포넌트 재사용**: 새로운 컴포넌트 작성 전 /app/components에서 기존 컴포넌트 검색
- **하드코딩 금지**: 비슷한 기능이 있으면 재사용하거나 확장하여 사용
- **컴포넌트 분석**: Read 도구로 기존 컴포넌트의 interface/props 확인 후 활용

### TypeScript

- **any 타입 절대 금지** - 타입 안전성을 위해 어떤 상황에서도 any 사용 불가
- 엄격한 타입 체크
- Interface 우선 사용

### 컴포넌트

- 사용 전 Read 도구로 interface/props 확인 필수
- next/image 사용 필수 (img 태그 금지)
- **시맨틱 헤딩**: h1~h6 태그는 페이지 구조에 맞게 순차적으로 사용
- 타입 에러 즉시 수정

### 데이터 페칭

- TanStack Query 필수 (useState + useEffect 금지)
- QueryKey: ['기능명', ...의존성]

### 스타일링

- **CSS 변수 우선 사용**: 색상은 `/public/styles/base/_css_variables.scss`의 CSS 변수 사용 (예: `var(--primary-color-normal)`)
- **abstracts 폴더 활용**: `/public/styles/abstracts/` 내 변수, 믹스인, 함수는 전역 사용 가능
- **기존 스타일 재사용**: 색상, 사이즈, 믹스인 등은 abstracts에서 가져와 사용
- SCSS 중첩 구조 필수
- SCSS Modules 사용
- 인라인 스타일은 불가피한 경우를 제외하고 사용 금지.

### Git

- dev 브랜치 개발
- main 브랜치 배포
