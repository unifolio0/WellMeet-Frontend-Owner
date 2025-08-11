# API 설정 가이드

## 개요

WellMeet 프론트엔드 애플리케이션의 API 도메인 설정 가이드입니다.

## 현재 설정

### 기본 API 도메인
- **개발 환경**: `http://localhost:8080`
- **프로덕션 환경**: 환경 변수로 설정

### API 엔드포인트
```
POST   http://localhost:8080/api/notifications/subscribe
DELETE http://localhost:8080/api/notifications/unsubscribe
POST   http://localhost:8080/api/notifications/test-push
POST   http://localhost:8080/api/notifications/send
POST   http://localhost:8080/api/notifications/sync
GET    http://localhost:8080/api/notifications/subscription-status
```

---

## 환경 변수 설정

### 1. 환경 변수 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성합니다:

```bash
cp .env.example .env.local
```

### 2. 환경 변수 설정

`.env.local` 파일 내용:

```env
# 개발 환경
VITE_API_BASE_URL=http://localhost:8080

# 또는 다른 백엔드 서버
# VITE_API_BASE_URL=http://localhost:3000
# VITE_API_BASE_URL=https://dev-api.wellmeet.com
```

### 3. 프로덕션 환경 설정

프로덕션 빌드 시 환경 변수 설정:

```bash
# 빌드 시 환경 변수 설정
VITE_API_BASE_URL=https://api.wellmeet.com npm run build

# 또는 .env.production 파일 생성
echo "VITE_API_BASE_URL=https://api.wellmeet.com" > .env.production
```

---

## 파일별 API 사용법

### 1. JavaScript/JSX 파일에서 사용

```javascript
import { NotificationAPI } from '../config/api';

// 구독 API 호출
const response = await fetch(NotificationAPI.subscribe(), {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});
```

### 2. 서비스 워커에서 사용

서비스 워커는 ES 모듈을 직접 import할 수 없으므로, `public/sw.js` 파일 상단에서 직접 설정:

```javascript
// 서비스 워커용 API 설정
const API_BASE_URL = 'http://localhost:8080';
const API_ENDPOINTS = {
  SUBSCRIBE: `${API_BASE_URL}/api/notifications/subscribe`,
  SYNC: `${API_BASE_URL}/api/notifications/sync`
};

// 사용 예시
fetch(API_ENDPOINTS.SUBSCRIBE, { ... });
```

---

## API 설정 변경 방법

### 1. 중앙 설정 파일 수정

`config/api.js` 파일에서 기본 URL 변경:

```javascript
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  // ...
};
```

### 2. 서비스 워커 설정 변경

`public/sw.js` 파일 상단의 `API_BASE_URL` 변경:

```javascript
const API_BASE_URL = 'http://your-api-server:port';
```

### 3. 새로운 API 엔드포인트 추가

`config/api.js` 파일의 `ENDPOINTS` 객체에 추가:

```javascript
ENDPOINTS: {
  NOTIFICATIONS: {
    // 기존 엔드포인트들...
    NEW_ENDPOINT: '/api/notifications/new-endpoint'
  }
}
```

그리고 헬퍼 함수도 추가:

```javascript
export const NotificationAPI = {
  // 기존 함수들...
  newEndpoint: () => getApiUrl(API_CONFIG.ENDPOINTS.NOTIFICATIONS.NEW_ENDPOINT)
};
```

---

## 환경별 설정 예시

### 개발 환경
```env
VITE_API_BASE_URL=http://localhost:8080
```

### 스테이징 환경
```env
VITE_API_BASE_URL=https://staging-api.wellmeet.com
```

### 프로덕션 환경
```env
VITE_API_BASE_URL=https://api.wellmeet.com
```

---

## 트러블슈팅

### 1. CORS 에러가 발생하는 경우

백엔드 서버에서 CORS 설정 확인:

```javascript
// Express.js 예시
app.use(cors({
  origin: ['http://localhost:5173', 'https://wellmeet.com'],
  credentials: true
}));
```

### 2. 404 에러가 발생하는 경우

1. 백엔드 서버가 실행 중인지 확인
2. API 도메인과 포트 번호 확인
3. 환경 변수 설정 확인

```bash
# 환경 변수 확인
echo $VITE_API_BASE_URL
```

### 3. 환경 변수가 적용되지 않는 경우

1. 파일명 확인 (`.env.local` 또는 `.env.production`)
2. `VITE_` 접두사 확인
3. 개발 서버 재시작

```bash
npm run dev
```

---

## 주의사항

1. **환경 변수 접두사**: Vite에서는 `VITE_` 접두사가 필요합니다.
2. **서비스 워커**: 별도로 API URL을 설정해야 합니다.
3. **보안**: 프로덕션에서는 반드시 HTTPS를 사용하세요.
4. **CORS**: 백엔드에서 프론트엔드 도메인을 허용해야 합니다.

---

## 현재 프로젝트 파일 구조

```
├── config/
│   └── api.js              # API 설정 중앙 관리
├── services/
│   └── notificationService.js  # API 호출 서비스
├── components/
│   └── PushTestPage.jsx    # 테스트 페이지
├── public/
│   └── sw.js              # 서비스 워커 (별도 설정)
├── .env.example           # 환경 변수 예시
└── .env.local             # 로컬 환경 변수 (생성 필요)
```