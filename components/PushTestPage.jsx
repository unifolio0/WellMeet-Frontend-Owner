import { useState } from 'react';
import { NotificationAPI } from '../config/api';

export function PushTestPage() {
  const [message, setMessage] = useState('');

  const sendTestPush = async () => {
    try {
      const response = await fetch(NotificationAPI.testPush(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: '테스트 푸시 알림',
          body: '백엔드에서 전송된 테스트 메시지입니다.',
          data: {
            url: '/notifications',
            timestamp: Date.now()
          }
        })
      });

      if (response.ok) {
        setMessage('테스트 푸시 알림이 전송되었습니다!');
      } else {
        setMessage('백엔드 API가 없거나 응답하지 않습니다.');
      }
    } catch (error) {
      setMessage('네트워크 오류: ' + error.message);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">푸시 알림 테스트</h2>
      
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">📱 현재 구현된 기능:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>브라우저 알림 권한 요청</li>
            <li>서비스 워커 등록</li>
            <li>푸시 구독/해제</li>
            <li>로컬 테스트 알림 표시</li>
            <li>백엔드 API 연동 준비</li>
          </ul>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">🔧 백엔드 API 연동:</h3>
          <p className="text-sm mb-3">
            현재는 개발 환경이므로 백엔드 API가 없어도 동작합니다. 
            실제 푸시 알림을 받으려면 다음 API가 필요합니다:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><code>POST /api/notifications/subscribe</code> - 구독 정보 저장</li>
            <li><code>DELETE /api/notifications/unsubscribe</code> - 구독 해제</li>
            <li><code>POST /api/notifications/test-push</code> - 테스트 푸시 전송</li>
          </ul>
        </div>

        <button
          onClick={sendTestPush}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          백엔드 테스트 푸시 전송
        </button>

        {message && (
          <div className={`p-3 rounded-lg ${
            message.includes('전송되었습니다') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">💡 사용 방법:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>헤더의 푸시 알림 버튼 클릭</li>
            <li>브라우저에서 알림 허용</li>
            <li>푸시 구독 완료 (초록색 점 표시)</li>
            <li>백엔드에서 푸시 알림 전송</li>
          </ol>
        </div>
      </div>
    </div>
  );
}