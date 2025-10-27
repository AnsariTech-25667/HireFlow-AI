const CACHE_NAME = 'hireflow-ai-v1.0.0';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/offline.html',
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => {
        console.log('💾 HireFlow AI: Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ HireFlow AI: Service worker installed');
        return self.skipWaiting();
      })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('🗑️ HireFlow AI: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('🚀 HireFlow AI: Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches
      .match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }

        return fetch(event.request).then(response => {
          // Don't cache if not a valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== 'basic'
          ) {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      })
      .catch(() => {
        // Fallback to offline page for navigation requests
        if (event.request.destination === 'document') {
          return caches.match('/offline.html');
        }
      })
  );
});

// Background sync for form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'job-application') {
    event.waitUntil(syncJobApplications());
  } else if (event.tag === 'chat-messages') {
    event.waitUntil(syncChatMessages());
  } else if (event.tag === 'application-status') {
    event.waitUntil(syncApplicationStatus());
  }
});

// Push notifications
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();

    const options = {
      body: data.body,
      icon: data.icon || '/pwa-192x192.png',
      badge: '/badge-72x72.png',
      vibrate: [200, 100, 200],
      data: {
        url: data.url,
        timestamp: data.timestamp,
        type: data.type,
      },
      actions: [
        {
          action: 'view',
          title: 'View',
          icon: '/action-explore.png',
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
        },
      ],
      requireInteraction: data.type === 'interview_scheduled',
      tag: data.type || 'general',
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  } else {
    const options = {
      body: 'New job opportunities available!',
      icon: '/pwa-192x192.png',
      badge: '/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2',
      },
      actions: [
        {
          action: 'explore',
          title: 'View Jobs',
          icon: '/action-explore.png',
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/action-close.png',
        },
      ],
    };

    event.waitUntil(
      self.registration.showNotification('HireFlow AI by Maaz Ansari', options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'view' || !event.action) {
    const url = event.notification.data?.url || '/';

    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  } else if (event.action === 'explore') {
    event.waitUntil(clients.openWindow('/'));
  }
});

// Helper function for background sync
async function syncJobApplications() {
  try {
    const pendingApplications = await getPendingApplications();

    for (const application of pendingApplications) {
      try {
        await submitApplication(application);
        await removePendingApplication(application.id);
      } catch (error) {
        console.error('Failed to sync application:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

async function syncChatMessages() {
  try {
    const cache = await caches.open('chat-messages-sync');
    const requests = await cache.keys();

    for (const request of requests) {
      const response = await cache.match(request);
      const data = await response.json();

      await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      await cache.delete(request);
    }
  } catch (error) {
    console.error('Error syncing chat messages:', error);
  }
}

async function syncApplicationStatus() {
  try {
    const cache = await caches.open('application-status-sync');
    const requests = await cache.keys();

    for (const request of requests) {
      const response = await cache.match(request);
      const data = await response.json();

      await fetch('/api/applications/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      await cache.delete(request);
    }
  } catch (error) {
    console.error('Error syncing application status:', error);
  }
}

// IndexedDB helpers (simplified)
function getPendingApplications() {
  return new Promise(resolve => {
    // Mock implementation - in real app, use IndexedDB
    resolve([]);
  });
}

function submitApplication(application) {
  return fetch('/api/applications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(application),
  });
}

function removePendingApplication(id) {
  return new Promise(resolve => {
    // Mock implementation - in real app, use IndexedDB
    resolve();
  });
}
