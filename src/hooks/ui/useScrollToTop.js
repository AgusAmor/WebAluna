import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Custom hook to scroll to top on route change
 * Automatically scrolls the page to the top when the route changes
 */
export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top of window
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    // Also scroll main content area to top (for nested scrolling scenarios)
    const mainContent = document.querySelector("main");
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  }, [pathname]);
};
