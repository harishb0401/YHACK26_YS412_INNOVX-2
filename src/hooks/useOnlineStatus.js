import { useState, useEffect } from 'react';
import { isOnline, subscribeNetworkStatus, setSimulatedOffline, isSimulatedOffline } from '../services/offline/networkStatus';

/**
 * Custom React hook for tracking online/offline state
 * @returns {{ online: boolean, simulatedOffline: boolean, toggleSimulatedOffline: Function }}
 */
export function useOnlineStatus() {
  const [online, setOnline] = useState(() => isOnline());
  const [simOffline, setSimOffline] = useState(() => isSimulatedOffline());

  useEffect(() => {
    const unsubscribe = subscribeNetworkStatus((status) => {
      setOnline(status);
      setSimOffline(isSimulatedOffline());
    });
    return unsubscribe;
  }, []);

  const toggleSimulatedOffline = () => {
    const next = !isSimulatedOffline();
    setSimulatedOffline(next);
    setSimOffline(next);
    setOnline(isOnline());
  };

  return {
    online,
    simulatedOffline: simOffline,
    toggleSimulatedOffline
  };
}

export default useOnlineStatus;
