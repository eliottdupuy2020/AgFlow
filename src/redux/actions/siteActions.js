export const START_WORKING = 'START_WORKING';
export const END_WORKING = 'END_WORKING';
export const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION';

export function startWorking() {
  return {
    type: START_WORKING,
  };
}

export function endWorking() {
  return {
    type: END_WORKING,
  };
}

export function showNotification(notificationData) {
  return {
    type: SHOW_NOTIFICATION,
    notification: notificationData,
  };
}
