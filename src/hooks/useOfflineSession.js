import { useState, useEffect } from 'react';
import { getOfflineCollectorSession, AUTH_STATES } from '../services/offline/offlineSession';
import { isOnline, subscribeNetworkStatus } from '../services/offline/networkStatus';

/**
 * Custom React hook for evaluating online vs offline authentication state
 * @param {Object|null} currentUser - Active user from App state
 * @returns {{
 *   authState: string,
 *   isOfflineAuthenticated: boolean,
 *   isOnline: boolean,
 *   offlineUser: Object|null,
 *   isChecking: boolean
 * }}
 */
export function useOfflineSession(currentUser) {
  const [authState, setAuthState] = useState(AUTH_STATES.NOT_AUTHENTICATED);
  const [offlineUser, setOfflineUser] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const [online, setOnline] = useState(() => isOnline());

  useEffect(() => {
    const unsub = subscribeNetworkStatus(status => setOnline(status));
    return unsub;
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function evaluateAuth() {
      setIsChecking(true);
      if (online && currentUser) {
        if (isMounted) {
          setAuthState(AUTH_STATES.AUTHENTICATED_ONLINE);
          setIsChecking(false);
        }
        return;
      }

      // Check offline session
      const result = await getOfflineCollectorSession();
      if (!isMounted) return;

      if (result.state === AUTH_STATES.AUTHENTICATED_OFFLINE) {
        setOfflineUser(result.user);
        setAuthState(AUTH_STATES.AUTHENTICATED_OFFLINE);
      } else if (result.state === AUTH_STATES.SESSION_EXPIRED) {
        setAuthState(AUTH_STATES.SESSION_EXPIRED);
      } else {
        setAuthState(currentUser ? AUTH_STATES.AUTHENTICATED_ONLINE : AUTH_STATES.NOT_AUTHENTICATED);
      }
      setIsChecking(false);
    }

    evaluateAuth();

    return () => {
      isMounted = false;
    };
  }, [online, currentUser]);

  return {
    authState,
    isOfflineAuthenticated: authState === AUTH_STATES.AUTHENTICATED_OFFLINE,
    isOnline: online,
    offlineUser,
    isChecking
  };
}

export default useOfflineSession;
