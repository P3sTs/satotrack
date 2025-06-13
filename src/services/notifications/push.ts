
// Verificar se o navegador suporta notificações push
export const checkPushNotificationsSupport = (): boolean => {
  return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
};

// Solicitar permissão para notificações
export const requestPushPermission = async (): Promise<NotificationPermission> => {
  if (!checkPushNotificationsSupport()) {
    throw new Error('Push notifications não são suportadas neste navegador');
  }

  if (Notification.permission === 'default') {
    return await Notification.requestPermission();
  }
  
  return Notification.permission;
};

// Enviar notificação push local
export const sendPushNotification = (title: string, options: NotificationOptions = {}) => {
  if (!checkPushNotificationsSupport()) {
    console.warn('Push notifications não são suportadas');
    return;
  }

  if (Notification.permission === 'granted') {
    const defaultOptions: NotificationOptions = {
      icon: '/icon-192x192.png',
      badge: '/icon-72x72.png',
      requireInteraction: true,
      ...options
    };

    try {
      new Notification(title, defaultOptions);
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
    }
  }
};

// Registrar service worker para notificações (futura implementação)
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registrado:', registration);
      return registration;
    } catch (error) {
      console.error('Erro ao registrar Service Worker:', error);
    }
  }
};
