// API 설정 (서비스 워커용)
const API_BASE_URL = 'http://localhost:8080';
const API_ENDPOINTS = {
  SUBSCRIBE: `${API_BASE_URL}/notification/subscribe`,
  SYNC: `${API_BASE_URL}/notification/sync`
};

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing Service Worker ...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating Service Worker ...');
  event.waitUntil(clients.claim());
});

self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push Received:', event.data?.text());
  
  if (!event.data) {
    console.error('[Service Worker] No push data received');
    return;
  }

  let payload;
  let notificationData;
  
  try {
    payload = event.data.json();
    notificationData = payload;
  } catch (error) {
    console.error('[Service Worker] Error parsing push data:', error);
    notificationData = {
      title: 'New Notification',
      body: event.data.text(),
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png'
    };
  }

  const { title, body, icon, badge, data, vibrate, requireInteraction } = notificationData;

  const options = {
    body: body || 'You have a new notification',
    icon: icon || '/icon-192x192.png',
    badge: badge || '/badge-72x72.png',
    vibrate: vibrate || [200, 100, 200],
    data: {
      ...data,
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
        icon: '/images/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/images/xmark.png'
      }
    ],
    // 각 알림마다 고유한 태그 생성 (타임스탬프 + 랜덤)
    tag: notificationData.tag || `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    requireInteraction: requireInteraction !== undefined ? requireInteraction : false
  };

  event.waitUntil(
    self.registration.showNotification(title || 'New Notification', options)
      .catch(error => {
        console.error('[Service Worker] Error showing notification:', error);
      })
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click received:', event.notification.tag);
  
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/notifications';

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    }).catch(error => {
      console.error('[Service Worker] Error handling notification click:', error);
    })
  );
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-notifications') {
    console.log('[Service Worker] Background sync triggered');
    event.waitUntil(
      fetch(API_ENDPOINTS.SYNC, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        console.log('[Service Worker] Background sync completed:', response.status);
      }).catch(error => {
        console.error('[Service Worker] Background sync failed:', error);
      })
    );
  }
});

self.addEventListener('pushsubscriptionchange', (event) => {
  console.log('[Service Worker] Push subscription changed');
  event.waitUntil(
    self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array('BCjLRdYi3EapfKAjZlIONNWb7PgUGnSo9-HDedbcd02o0zwriW-93jZ35Ufqu_C4jFtcKuHCdsGA_3TYyAHXqxs')
    }).then(subscription => {
      return fetch(API_ENDPOINTS.SUBSCRIBE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
      });
    }).catch(error => {
      console.error('[Service Worker] Re-subscription failed:', error);
    })
  );
});

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}