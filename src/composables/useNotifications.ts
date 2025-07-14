import { ref } from 'vue';

interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

const notifications = ref<Notification[]>([]);
let notificationId = 0;

export function useNotifications() {

  const showNotification = (message: string, type: Notification['type'] = 'info') => {
    const id = notificationId++;
    notifications.value.push({ id, message, type });

    // For now, using alert. This can be replaced with a proper UI notification.
    alert(`${type.toUpperCase()}: ${message}`);

    // Optionally, remove notification after some time
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id: number) => {
    notifications.value = notifications.value.filter(n => n.id !== id);
  };

  const showError = (message: string) => {
    showNotification(message, 'error');
  };

  const showSuccess = (message: string) => {
    showNotification(message, 'success');
  };

  const showInfo = (message: string) => {
    showNotification(message, 'info');
  };

  const showWarning = (message: string) => {
    showNotification(message, 'warning');
  };

  return {
    notifications,
    showError,
    showSuccess,
    showInfo,
    showWarning,
    showNotification,
  };
}
