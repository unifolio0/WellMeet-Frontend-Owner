// API 설정 중앙 관리
declare global {
  interface ImportMeta {
    env: {
      VITE_API_BASE_URL?: string;
      DEV: boolean;
      MODE: string;
    };
  }
}

const API_CONFIG = {
  // 환경 변수에서 API URL을 가져오고, 없으면 기본값 사용
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  
  // API 엔드포인트들
  ENDPOINTS: {
    NOTIFICATIONS: {
      SUBSCRIBE: '/notification/subscribe?userId=1',
      UNSUBSCRIBE: '/notification/unsubscribe?userId=1', 
      TEST_PUSH: '/notification/test-push?userId=1',
      SEND: '/notification/send',
      SYNC: '/notification/sync',
      STATUS: '/notification/subscription-status'
    }
  }
};

// 완전한 URL을 생성하는 헬퍼 함수
export function getApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

// 알림 관련 API URL들을 쉽게 가져오는 헬퍼 함수들
export const NotificationAPI = {
  subscribe: () => getApiUrl(API_CONFIG.ENDPOINTS.NOTIFICATIONS.SUBSCRIBE),
  unsubscribe: () => getApiUrl(API_CONFIG.ENDPOINTS.NOTIFICATIONS.UNSUBSCRIBE),
  testPush: () => getApiUrl(API_CONFIG.ENDPOINTS.NOTIFICATIONS.TEST_PUSH),
  send: () => getApiUrl(API_CONFIG.ENDPOINTS.NOTIFICATIONS.SEND),
  sync: () => getApiUrl(API_CONFIG.ENDPOINTS.NOTIFICATIONS.SYNC),
  status: () => getApiUrl(API_CONFIG.ENDPOINTS.NOTIFICATIONS.STATUS)
};

// 개발 환경 여부 확인
export const isDevelopment = import.meta.env.DEV;

// 현재 설정 정보 로그 (개발 환경에서만)
if (isDevelopment) {
  console.log('🔧 API Configuration:', {
    baseUrl: API_CONFIG.BASE_URL,
    environment: import.meta.env.MODE,
    endpoints: Object.keys(API_CONFIG.ENDPOINTS.NOTIFICATIONS)
  });
}

export default API_CONFIG;