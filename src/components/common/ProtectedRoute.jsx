import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { BsFillShieldLockFill } from "react-icons/bs";
import { useAuth } from "../../context/AuthContext";

/**
 * Protected Route Component
 * Redirects to home if not authenticated
 * Redirects to home if user doesn't have required role
 */
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-3">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-2"></div>
          <p className="mt-4 text-blue-1 font-family-comfortaa">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (requireAdmin && user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-3 p-4">
        <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="flex justify-center mb-4">
            <BsFillShieldLockFill className="text-blue-1" size={64} />
          </div>
          <h2 className="text-2xl font-bold text-blue-1 font-family-comfortaa mb-2">
            Acceso Denegado
          </h2>
          <p className="text-gray-1 mb-6">
            No tienes permisos para acceder a esta página.
            <br />
            Se requiere rol de administrador.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-blue-2 text-white rounded-lg hover:bg-gold transition-colors font-semibold"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requireAdmin: PropTypes.bool,
};

export default ProtectedRoute;
