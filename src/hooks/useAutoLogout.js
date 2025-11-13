import { useEffect, useRef } from "react";

/**
 * useAutoLogout hook
 * Automatically logs out the user after a period of inactivity.
 * @param {function} onLogout - Function to call when auto-logout is triggered.
 * @param {number} timeout - Inactivity timeout in milliseconds (default: 15 minutes).
 */
export function useAutoLogout(onLogout, timeout = 15 * 60 * 1000) {
  const timerRef = useRef();

  useEffect(() => {
    const resetTimer = () => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onLogout();
      }, timeout);
    };

    // List of events that indicate user activity
    const events = ["mousemove", "keydown", "mousedown", "touchstart", "scroll"];
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer(); // Start timer on mount

    return () => {
      clearTimeout(timerRef.current);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [onLogout, timeout]);
}
