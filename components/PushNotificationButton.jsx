import { useState } from 'react';
import { usePushNotification } from '../hooks/usePushNotification';
import { Button } from './ui/button';
import { Bell, BellOff, Loader2 } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { Alert, AlertDescription } from './ui/alert';

export function PushNotificationButton() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    error,
    subscribe,
    unsubscribe,
    requestPermission,
    clearError
  } = usePushNotification();
  
  console.log('PushNotificationButton state:', { 
    isSupported, 
    permission, 
    isSubscribed, 
    isLoading,
    isOpen,
    error 
  });

  const handleSubscribe = async () => {
    console.log('handleSubscribe called');
    const success = await subscribe();
    if (success) {
      setIsOpen(false);
    }
  };

  const handleUnsubscribe = async () => {
    console.log('handleUnsubscribe called');
    const success = await unsubscribe();
    if (success) {
      setIsOpen(false);
    }
  };

  const handleRequestPermission = async () => {
    console.log('handleRequestPermission called');
    const result = await requestPermission();
    console.log('Permission request result:', result);
  };

  if (!isSupported) {
    return null;
  }

  const getButtonIcon = () => {
    if (isLoading) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }
    return isSubscribed ? (
      <Bell className="h-4 w-4" />
    ) : (
      <BellOff className="h-4 w-4" />
    );
  };

  const getButtonVariant = () => {
    if (isSubscribed) {
      return 'default';
    }
    return 'outline';
  };

  return (
    <Popover open={isOpen} onOpenChange={(open) => {
      console.log('Popover open state changed:', open);
      setIsOpen(open);
    }}>
      <PopoverTrigger asChild>
        <Button
          variant={getButtonVariant()}
          size="icon"
          className="relative p-2 rounded-full hover:bg-gray-200 transition-colors"
          aria-label={isSubscribed ? 'Push notifications enabled' : 'Push notifications disabled'}
          onClick={() => console.log('Button clicked')}
        >
          {getButtonIcon()}
          {isSubscribed && (
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Push Notifications</h4>
            <p className="text-sm text-muted-foreground">
              Stay updated with real-time notifications
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription className="flex items-center justify-between">
                <span className="text-sm">{error}</span>
                <button
                  onClick={clearError}
                  className="ml-2 text-xs underline hover:no-underline"
                >
                  Clear
                </button>
              </AlertDescription>
            </Alert>
          )}

          {permission === 'denied' ? (
            <Alert variant="destructive">
              <AlertDescription className="text-sm">
                Notifications are blocked. Please enable them in your browser settings.
              </AlertDescription>
            </Alert>
          ) : permission === 'default' ? (
            <div className="space-y-3">
              <Alert>
                <AlertDescription className="text-sm">
                  Grant permission to receive notifications
                </AlertDescription>
              </Alert>
              <Button
                onClick={handleRequestPermission}
                disabled={isLoading}
                className="w-full"
                size="sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Requesting...
                  </>
                ) : (
                  'Grant Permission'
                )}
              </Button>
            </div>
          ) : isSubscribed ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <span className="text-sm text-green-600">Active</span>
              </div>
              <Button
                onClick={handleUnsubscribe}
                disabled={isLoading}
                variant="outline"
                className="w-full"
                size="sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Disabling...
                  </>
                ) : (
                  <>
                    <BellOff className="mr-2 h-4 w-4" />
                    Disable Notifications
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <span className="text-sm text-muted-foreground">Inactive</span>
              </div>
              <Button
                onClick={handleSubscribe}
                disabled={isLoading}
                className="w-full"
                size="sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enabling...
                  </>
                ) : (
                  <>
                    <Bell className="mr-2 h-4 w-4" />
                    Enable Notifications
                  </>
                )}
              </Button>
            </div>
          )}

          <div className="pt-3 border-t">
            <p className="text-xs text-muted-foreground">
              You'll receive notifications for new bookings, cancellations, and reviews.
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}