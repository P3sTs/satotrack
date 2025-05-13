
import { toast } from '@/components/ui/sonner';

// Function to check if push notifications are supported and enabled
export const checkPushNotificationsSupport = () => {
  return 'Notification' in window && 'serviceWorker' in navigator;
};

// Function to request push notification permission
export const requestPushPermission = async (): Promise<boolean> => {
  if (!checkPushNotificationsSupport()) {
    toast.error('Este navegador não suporta notificações push');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

// Function to send a browser notification
export const sendPushNotification = (
  title: string,
  options: NotificationOptions = {}
) => {
  if (Notification.permission === 'granted') {
    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });

      notification.onclick = function() {
        window.focus();
        notification.close();
      };

      return true;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  }
  
  return false;
};
