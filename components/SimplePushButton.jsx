import { useState } from 'react';
import { Bell, BellOff } from 'lucide-react';

export function SimplePushButton() {
  const [isSupported] = useState(() => {
    return 'serviceWorker' in navigator && 
           'PushManager' in window && 
           'Notification' in window;
  });

  const [permission, setPermission] = useState(() => {
    if (!('Notification' in window)) return 'unsupported';
    return Notification.permission;
  });

  const handleClick = async () => {
    console.log('SimplePushButton clicked');
    console.log('Current permission:', permission);
    
    if (!isSupported) {
      alert('브라우저가 푸시 알림을 지원하지 않습니다.');
      return;
    }

    if (permission === 'default') {
      console.log('Requesting permission...');
      const newPermission = await Notification.requestPermission();
      console.log('Permission result:', newPermission);
      setPermission(newPermission);
      
      if (newPermission === 'granted') {
        alert('알림 권한이 허용되었습니다!');
      } else {
        alert('알림 권한이 거부되었습니다.');
      }
    } else if (permission === 'granted') {
      // 테스트 알림 표시
      console.log('Showing test notification');
      try {
        const notification = new Notification('🔔 테스트 알림', {
          body: '푸시 알림이 정상적으로 작동합니다!',
          icon: '/favicon.ico',
          tag: 'test-notification',
          requireInteraction: false
        });
        
        notification.onclick = () => {
          console.log('Test notification clicked');
          window.focus();
          notification.close();
        };
        
        console.log('Test notification created successfully');
      } catch (error) {
        console.error('Error creating test notification:', error);
        alert('알림 생성 중 오류가 발생했습니다: ' + error.message);
      }
    } else {
      alert('알림 권한이 거부되었습니다. 브라우저 설정에서 허용해주세요.');
    }
  };

  if (!isSupported) {
    return (
      <button 
        className="p-2 rounded-full bg-gray-200 cursor-not-allowed"
        disabled
        title="브라우저가 푸시 알림을 지원하지 않습니다"
      >
        <BellOff size={20} className="text-gray-400" />
      </button>
    );
  }

  return (
    <button 
      onClick={handleClick}
      className="relative p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
      title={
        permission === 'default' ? '알림 권한 요청' :
        permission === 'granted' ? '테스트 알림 보내기' :
        '알림 권한 거부됨'
      }
    >
      {permission === 'granted' ? (
        <Bell size={20} className="text-blue-600" />
      ) : (
        <BellOff size={20} className="text-gray-600" />
      )}
      {permission === 'granted' && (
        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500" />
      )}
    </button>
  );
}