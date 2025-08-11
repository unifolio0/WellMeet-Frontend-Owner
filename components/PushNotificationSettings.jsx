import { usePushNotification } from '../hooks/usePushNotification';
import { Switch } from './ui/switch';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Bell, BellOff, Info, AlertTriangle } from 'lucide-react';

export function PushNotificationSettings() {
  const {
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
  } = usePushNotification();

  const handleToggle = async (checked) => {
    if (checked) {
      await subscribe();
    } else {
      await unsubscribe();
    }
  };

  const handleTestNotification = async () => {
    await testNotification();
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Receive real-time notifications about your restaurant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Push notifications are not supported in your browser. 
              Please use a modern browser like Chrome, Firefox, or Edge.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Push Notifications
        </CardTitle>
        <CardDescription>
          Receive real-time notifications about bookings, reviews, and important updates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={clearError}
                className="ml-2 text-sm underline hover:no-underline"
              >
                Dismiss
              </button>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label htmlFor="push-notifications" className="text-sm font-medium">
              Enable Push Notifications
            </label>
            <p className="text-sm text-muted-foreground">
              {isSubscribed ? 'You will receive notifications' : 'You won\'t receive notifications'}
            </p>
          </div>
          <Switch
            id="push-notifications"
            checked={isSubscribed}
            onCheckedChange={handleToggle}
            disabled={isLoading}
            aria-label="Toggle push notifications"
          />
        </div>

        {permission === 'denied' && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Notification permission has been denied. 
              Please enable notifications in your browser settings to use this feature.
            </AlertDescription>
          </Alert>
        )}

        {permission === 'default' && !isSubscribed && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>You need to grant permission to receive notifications</span>
              <Button
                size="sm"
                variant="outline"
                onClick={requestPermission}
                disabled={isLoading}
              >
                Grant Permission
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {isSubscribed && (
          <div className="pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestNotification}
              disabled={isLoading}
              className="w-full"
            >
              Send Test Notification
            </Button>
          </div>
        )}

        <div className="pt-4 border-t space-y-2">
          <h4 className="text-sm font-medium">Notification Types</h4>
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">New bookings</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Booking cancellations</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">New reviews</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">System updates</span>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <span className={`font-medium ${isSubscribed ? 'text-green-600' : 'text-gray-500'}`}>
              {isLoading ? 'Loading...' : isSubscribed ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-muted-foreground">Permission</span>
            <span className={`font-medium capitalize ${
              permission === 'granted' ? 'text-green-600' : 
              permission === 'denied' ? 'text-red-600' : 
              'text-yellow-600'
            }`}>
              {permission}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}