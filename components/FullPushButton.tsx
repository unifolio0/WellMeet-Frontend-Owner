import { useState, useEffect } from 'react';
import { Bell, BellOff, Loader2 } from 'lucide-react';
import notificationService from '../services/notificationService';

export function FullPushButton() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkSupport = () => {
      const supported = notificationService.isSupported();
      console.log('Push notification support:', supported);
      setIsSupported(supported);
      
      if (supported) {
        const currentPermission = notificationService.getPermissionStatus();
        console.log('Current permission:', currentPermission);
        setPermission(currentPermission);
      }
    };

    checkSupport();
  }, []);

  useEffect(() => {
    const checkSubscription = async () => {
      if (isSupported && permission === 'granted') {
        try {
          const subscribed = await notificationService.checkSubscriptionStatus();
          console.log('Is subscribed:', subscribed);
          setIsSubscribed(subscribed);
        } catch (error) {
          console.error('Error checking subscription:', error);
        }
      }
    };

    checkSubscription();
  }, [isSupported, permission]);

  const handleClick = async () => {
    console.log('FullPushButton clicked');
    setIsLoading(true);

    try {
      if (!isSupported) {
        alert('브라우저가 푸시 알림을 지원하지 않습니다.');
        return;
      }

      if (permission === 'default') {
        console.log('Requesting permission...');
        const newPermission = await notificationService.requestPermission();
        console.log('Permission result:', newPermission);
        setPermission(newPermission);
        
        if (newPermission !== 'granted') {
          alert('알림 권한이 거부되었습니다.');
          return;
        }
      }

      if (permission === 'denied') {
        alert('알림 권한이 거부되었습니다. 브라우저 설정에서 허용해주세요.');
        return;
      }

      // 구독 상태에 따라 구독/해제
      if (isSubscribed) {
        console.log('Unsubscribing...');
        const success = await notificationService.unsubscribe();
        if (success) {
          setIsSubscribed(false);
          alert('푸시 알림 구독이 해제되었습니다.');
        }
      } else {
        console.log('Subscribing...');
        const subscription = await notificationService.subscribe();
        if (subscription) {
          setIsSubscribed(true);
          alert('푸시 알림 구독이 완료되었습니다!');
          
          // 테스트 알림 표시
          setTimeout(() => {
            const notification = new Notification('🎉 구독 완료!', {
              body: '이제 실시간 알림을 받을 수 있습니다.',
              icon: '/favicon.ico'
            });
            
            notification.onclick = () => {
              window.focus();
              notification.close();
            };
          }, 1000);
        }
      }
    } catch (error: any) {
      console.error('Push notification error:', error);
      alert('오류가 발생했습니다: ' + error.message);
    } finally {
      setIsLoading(false);
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

  const getButtonTitle = () => {
    if (isLoading) return '처리 중...';
    if (permission === 'default') return '알림 권한 요청';
    if (permission === 'denied') return '알림 권한 거부됨';
    if (isSubscribed) return '푸시 알림 구독 해제';
    return '푸시 알림 구독';
  };

  const getButtonColor = () => {
    if (isSubscribed) return 'bg-green-100 hover:bg-green-200';
    if (permission === 'granted') return 'bg-blue-100 hover:bg-blue-200';
    return 'bg-gray-100 hover:bg-gray-200';
  };

  return (
    <button 
      onClick={handleClick}
      disabled={isLoading}
      className={`relative p-2 rounded-full transition-colors ${getButtonColor()}`}
      title={getButtonTitle()}
    >
      {isLoading ? (
        <Loader2 size={20} className="text-gray-600 animate-spin" />
      ) : isSubscribed ? (
        <Bell size={20} className="text-green-600" />
      ) : permission === 'granted' ? (
        <Bell size={20} className="text-blue-600" />
      ) : (
        <BellOff size={20} className="text-gray-600" />
      )}
      
      {isSubscribed && (
        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500 animate-pulse" />
      )}
    </button>
  );
}