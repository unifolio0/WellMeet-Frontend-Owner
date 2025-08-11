import { useState, useEffect, useCallback } from 'react';
import notificationService from '../services/notificationService';

export function usePushNotification() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          setIsSubscribed(subscribed);
        } catch (error: any) {
          console.error('Error checking subscription:', error);
          setError(error.message);
        }
      }
    };

    checkSubscription();
  }, [isSupported, permission]);

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      setError('Push notifications are not supported in this browser');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newPermission = await notificationService.requestPermission();
      setPermission(newPermission);
      return newPermission === 'granted';
    } catch (error: any) {
      console.error('Error requesting permission:', error);
      setError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const subscribe = useCallback(async () => {
    if (!isSupported) {
      setError('Push notifications are not supported in this browser');
      return false;
    }

    if (permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) {
        setError('Notification permission denied');
        return false;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      await notificationService.subscribe();
      setIsSubscribed(true);
      return true;
    } catch (error: any) {
      console.error('Error subscribing to push notifications:', error);
      setError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, permission, requestPermission]);

  const unsubscribe = useCallback(async () => {
    if (!isSupported) {
      setError('Push notifications are not supported in this browser');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const success = await notificationService.unsubscribe();
      if (success) {
        setIsSubscribed(false);
      }
      return success;
    } catch (error: any) {
      console.error('Error unsubscribing from push notifications:', error);
      setError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const testNotification = useCallback(async () => {
    if (!isSupported) {
      setError('Push notifications are not supported in this browser');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const success = await notificationService.testNotification();
      return success;
    } catch (error: any) {
      console.error('Error sending test notification:', error);
      setError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    error,
    subscribe,
    unsubscribe,
    requestPermission,
    testNotification,
    clearError
  };
}