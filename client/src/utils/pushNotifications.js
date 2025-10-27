// Push Notifications Service Worker Registration
export const registerPushNotifications = async () => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);

      // Request notification permission
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        console.log('Notification permission granted');

        // Subscribe to push notifications
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            process.env.REACT_APP_VAPID_PUBLIC_KEY || 'demo-key'
          ),
        });

        // Send subscription to server
        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(subscription),
        });

        return subscription;
      } else {
        console.log('Notification permission denied');
        return null;
      }
    } catch (error) {
      console.error('Error registering push notifications:', error);
      return null;
    }
  } else {
    console.log('Push messaging is not supported');
    return null;
  }
};

// Helper function to convert VAPID key
const urlBase64ToUint8Array = base64String => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

// Show local notification
export const showNotification = (title, options = {}) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/manifest-icon-192.png',
      badge: '/manifest-icon-192.png',
      vibrate: [200, 100, 200],
      ...options,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Auto close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    return notification;
  }
};

// Push notification types
export const NOTIFICATION_TYPES = {
  JOB_APPLICATION_UPDATE: 'job_application_update',
  NEW_JOB_MATCH: 'new_job_match',
  INTERVIEW_SCHEDULED: 'interview_scheduled',
  MESSAGE_RECEIVED: 'message_received',
  APPLICATION_VIEWED: 'application_viewed',
  HIRING_UPDATE: 'hiring_update',
};

// Send push notification via server
export const sendPushNotification = async (userId, type, data) => {
  try {
    const response = await fetch('/api/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        userId,
        type,
        data: {
          title: data.title,
          body: data.body,
          icon: data.icon || '/manifest-icon-192.png',
          url: data.url,
          timestamp: Date.now(),
          ...data,
        },
      }),
    });

    if (response.ok) {
      console.log('Push notification sent successfully');
      return true;
    } else {
      console.error('Failed to send push notification');
      return false;
    }
  } catch (error) {
    console.error('Error sending push notification:', error);
    return false;
  }
};

// Unsubscribe from notifications
export const unsubscribeFromNotifications = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();

          // Notify server
          await fetch('/api/push/unsubscribe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ endpoint: subscription.endpoint }),
          });

          console.log('Unsubscribed from push notifications');
          return true;
        }
      }
    } catch (error) {
      console.error('Error unsubscribing from notifications:', error);
    }
  }
  return false;
};

// Check if notifications are supported and enabled
export const isNotificationSupported = () => {
  return (
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'PushManager' in window
  );
};

export const getNotificationPermission = () => {
  if ('Notification' in window) {
    return Notification.permission;
  }
  return 'unsupported';
};
