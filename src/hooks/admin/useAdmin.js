import { useAuth } from "../../context/AuthContext";
import { isUserAdmin } from "../../middlewares/adminMiddleware";

/**
 * Hook to check if current user is admin
 * @returns {boolean} True if user is admin, false otherwise
 */
export function useIsAdmin() {
  const { user } = useAuth();
  return isUserAdmin(user);
}

/**
 * Hook to get current user
 * @returns {Object|null} Current user object or null
 */
export function useUser() {
  const { user } = useAuth();
  return user;
}

/**
 * Hook for admin-only operations
 * Provides error handling and loading states
 */
export function useAdminAction() {
  const isAdmin = useIsAdmin();

  const withAdminCheck = async (action) => {
    if (!isAdmin) {
      throw new Error("Only admins can perform this action");
    }
    return action();
  };

  return { isAdmin, withAdminCheck };
}
