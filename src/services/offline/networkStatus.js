/**
 * Eco-Link Network Connectivity Status Service
 * Listens to browser online/offline events and provides reactive network state.
 * Includes simulated offline capability for easy testing.
 */

let simulatedOffline = false;
const listeners = new Set();

export function isOnline() {
  if (simulatedOffline) return false;
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

export function setSimulatedOffline(status) {
  simulatedOffline = Boolean(status);
  notifyListeners();
}

export function isSimulatedOffline() {
  return simulatedOffline;
}

function notifyListeners() {
  const currentStatus = isOnline();
  listeners.forEach(callback => {
    try {
      callback(currentStatus);
    } catch (e) {
      console.error('Network status listener error:', e);
    }
  });
}

// Attach browser listeners once in client environment
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    if (!simulatedOffline) {
      notifyListeners();
    }
  });

  window.addEventListener('offline', () => {
    notifyListeners();
  });
}

/**
 * Subscribe to network connectivity changes
 * @param {Function} callback - receives boolean (true if online, false if offline)
 * @returns {Function} unsubscribe function
 */
export function subscribeNetworkStatus(callback) {
  listeners.add(callback);
  // Immediate initial call
  callback(isOnline());
  return () => {
    listeners.delete(callback);
  };
}

export default {
  isOnline,
  setSimulatedOffline,
  isSimulatedOffline,
  subscribeNetworkStatus
};
