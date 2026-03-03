import { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ImSpinner2 } from "react-icons/im";
import { useAuth } from "../context/AuthContext";
import { isUserAdmin } from "../utils/adminUtils";
import { useScrollToTop } from "../hooks/ui";
import Header from "../components/layout/Header";
import AdminSidebar from "../components/layout/AdminSidebar";
import Footer from "../components/layout/Footer";
import { FloatingCartButton, ProtectedRoute } from "../components/common";

// Lazy load with optimized prefetch
const Home = lazy(() => import("../pages/Home"));
const Products = lazy(() => import("../pages/Products"));
const Profile = lazy(() => import("../pages/Profile"));
const Contact = lazy(() => import("../pages/Contact"));
const About = lazy(() =>
  import("../pages/About").then((module) => ({ default: module.About })),
);
const Checkout = lazy(() => import("../pages/Checkout/Checkout.jsx"));
const Admin = lazy(() => import("../pages/Admin"));

const ProductManagement = lazy(
  () => import("../pages/Admin/Products/ProductManagement.jsx"),
);
const UserManagement = lazy(
  () => import("../pages/Admin/Users/UserManagement.jsx"),
);
const OrderManagement = lazy(
  () => import("../pages/Admin/Orders/OrderManagement.jsx"),
);

// Minimalist spinner for fast transitions
const LoadingFallback = () => (
  <div className="fixed inset-0 bg-white/95 z-40 flex items-center justify-center pointer-events-none">
    <ImSpinner2 className="animate-spin h-8 w-8 text-blue-2" />
  </div>
);

/**
 * Navigation Header Wrapper
 * Shows AdminSidebar for admins, regular Header for users
 * Memoized to prevent unnecessary re-renders
 */
const NavigationWrapper = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Header />;
  }

  const isAdmin = isUserAdmin(user);
  return isAdmin ? <AdminSidebar /> : <Header />;
};

/**
 * AdminMainWrapper
 * Adds left margin on desktop so content is never hidden behind the collapsed sidebar.
 * The sidebar is fixed w-16 when collapsed; this margin compensates for it.
 */
const AdminMainWrapper = ({ children }) => {
  const { user, loading } = useAuth();
  const isAdmin = !loading && isUserAdmin(user);
  return (
    <main
      className={`flex-1 transition-all duration-300${isAdmin ? " lg:ml-16" : ""}`}
    >
      {children}
    </main>
  );
};

/**
 * Scroll to Top Component
 * Uses the useScrollToTop hook to scroll when routes change
 */
const ScrollToTop = () => {
  useScrollToTop();
  return null;
};

/**
 * Prefetch hook para precargar componentes frecuentes
 * Reduce el tiempo de espera al cambiar de ruta
 */
const usePrefetch = () => {
  const location = useLocation();

  useEffect(() => {
    // Precargar páginas frecuentes después de un pequeño delay
    const timer = setTimeout(() => {
      // Precargar según la ruta actual
      if (location.pathname === "/") {
        // Si en Home, precargar Products
        import("../pages/Products");
      } else if (location.pathname === "/productos") {
        // Si en Products, precargar Home
        import("../pages/Home");
      }

      // Siempre precargar el Admin si es accesible (optimización)
      import("../pages/Admin");
    }, 100); // 100ms de delay para no interferir con renderizado actual

    return () => clearTimeout(timer);
  }, [location.pathname]);
};

/**
 * Componente interno de rutas con prefetch
 */
const RouteContent = () => {
  usePrefetch(); // Activa prefetch inteligente

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Products />} />
        <Route path="/sobre-nosotros" element={<About />} />
        <Route path="/contacto" element={<Contact />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/productos"
          element={
            <ProtectedRoute requireAdmin>
              <ProductManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <ProtectedRoute requireAdmin>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pedidos"
          element={
            <ProtectedRoute requireAdmin>
              <OrderManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-gray-1">Página no encontrada</p>
              </div>
            </div>
          }
        />
      </Routes>
    </Suspense>
  );
};

const AppRouter = () => {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <NavigationWrapper />
        <AdminMainWrapper>
          <RouteContent />
        </AdminMainWrapper>
        <Footer />

        {/* Floating Cart Button */}
        <FloatingCartButton />
      </div>
    </Router>
  );
};

export default AppRouter;
