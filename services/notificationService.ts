import { getVapidKey } from '../utils/vapid';
import { NotificationAPI } from '../config/api';

class NotificationService {
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

  async registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service Worker is not supported in this browser');
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      this.serviceWorkerRegistration = registration;
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  }

  async requestPermission() {
    if (!('Notification' in window)) {
      throw new Error('Notifications are not supported in this browser');
    }

    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);
    return permission;
  }

  async getSubscription() {
    if (!this.serviceWorkerRegistration) {
      await this.registerServiceWorker();
    }

    const subscription = await this.serviceWorkerRegistration!.pushManager.getSubscription();
    return subscription;
  }

  async subscribe() {
    if (!this.serviceWorkerRegistration) {
      await this.registerServiceWorker();
    }

    const permission = await this.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Notification permission denied');
    }

    try {
      console.log('Attempting push subscription with VAPID key...');
      
      const subscription = await this.serviceWorkerRegistration!.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: getVapidKey()
      });

        console.log('Push subscription created:', subscription);

      await this.sendSubscriptionToServer(subscription);
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      throw error;
    }
  }

  async unsubscribe() {
    const subscription = await this.getSubscription();
    
    if (!subscription) {
      console.log('No subscription found');
      return false;
    }

    try {
      const success = await subscription.unsubscribe();
      
      if (success) {
        await this.removeSubscriptionFromServer(subscription);
        console.log('Push subscription cancelled');
      }
      
      return success;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      throw error;
    }
  }

  async sendSubscriptionToServer(subscription: PushSubscription) {
    const token = this.getAuthToken();
    
    if (!token) {
      console.warn('No auth token found, skipping server subscription');
      // 개발 환경에서는 토큰 없이도 진행
      if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        return;
      }
    }

    const subscriptionData = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: this.arrayBufferToBase64(subscription.getKey('p256dh')!),
        auth: this.arrayBufferToBase64(subscription.getKey('auth')!)
      }
    };

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(NotificationAPI.subscribe(), {
        method: 'POST',
        headers,
        body: JSON.stringify(subscriptionData)
      });

      if (response.ok) {
        // 개발 환경에서 404 에러는 무시 (백엔드가 없을 수 있음)
        if (response.status === 404 && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
          console.warn('Backend API not available in development, continuing anyway');
          return { success: true, development: true };
        }
        throw new Error(`Server responded with ${response.status}`);
      }

      console.log('Subscription sent to server successfully');
      return await response.json();
    } catch (error) {
      // 개발 환경에서 네트워크 에러는 경고만 표시
      if ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        console.warn('Failed to send subscription to server (development mode):', error);
        return { success: true, development: true };
      }
      console.error('Failed to send subscription to server:', error);
      throw error;
    }
  }

  async removeSubscriptionFromServer(subscription?: PushSubscription) {
    const token = this.getAuthToken();
    
    if (!token && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      console.warn('No auth token found, skipping server unsubscription');
      return;
    }

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // endpoint를 body에 포함하여 전송
      const body = subscription ? JSON.stringify({
        endpoint: subscription.endpoint
      }) : undefined;

      const response = await fetch(NotificationAPI.unsubscribe(), {
        method: 'DELETE',
        headers,
        body
      });

      if (response.ok) {
        // 개발 환경에서 404 에러는 무시
        if (response.status === 404 && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
          console.warn('Backend API not available in development, continuing anyway');
          return true;
        }
        throw new Error(`Server responded with ${response.status}`);
      }

      console.log('Subscription removed from server successfully');
      return true;
    } catch (error) {
      // 개발 환경에서 네트워크 에러는 경고만 표시
      if ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        console.warn('Failed to remove subscription from server (development mode):', error);
        return true;
      }
      console.error('Failed to remove subscription from server:', error);
      throw error;
    }
  }

  getAuthToken() {
    const token = localStorage.getItem('authToken') || 
                  sessionStorage.getItem('authToken');
    return token;
  }

  arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  isSupported() {
    return 'serviceWorker' in navigator && 
           'PushManager' in window && 
           'Notification' in window;
  }

  getPermissionStatus() {
    if (!('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission;
  }

  async checkSubscriptionStatus() {
    try {
      const subscription = await this.getSubscription();
      return !!subscription;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return false;
    }
  }

  async testNotification() {
    const permission = await this.requestPermission();
    
    if (permission === 'granted') {
      const notification = new Notification('Test Notification', {
        body: 'This is a test notification from WellMeet',
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        // vibrate: [200, 100, 200], // Removed as not in standard NotificationOptions
        tag: 'test-notification'
      });

      notification.onclick = () => {
        console.log('Test notification clicked');
        window.focus();
        notification.close();
      };

      return true;
    }
    
    return false;
  }

  async enableBackgroundSync() {
    if (!this.serviceWorkerRegistration) {
      await this.registerServiceWorker();
    }

    if ('sync' in this.serviceWorkerRegistration!) {
      try {
        await (this.serviceWorkerRegistration as any).sync.register('sync-notifications');
        console.log('Background sync registered');
        return true;
      } catch (error: any) {
        console.error('Background sync registration failed:', error);
        return false;
      }
    }
    
    return false;
  }
}

export default new NotificationService();