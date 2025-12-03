import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ImSpinner2 } from "react-icons/im";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { FloatingCartButton, ProtectedRoute } from "../components/common";
import { AuthProvider } from "../context/AuthContext";

const Home = lazy(() => import("../pages/Home"));
const Products = lazy(() => import("../pages/Products"));
const Profile = lazy(() => import("../pages/Profile"));
const Admin = lazy(() => import("../pages/Admin"));

const ProductManagement = lazy(() =>
  import("../pages/Admin/Products/ProductManagement.jsx")
);
const UserManagement = lazy(() =>
  import("../pages/Admin/Users/UserManagement.jsx")
);

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <ImSpinner2 className="animate-spin h-12 w-12 text-blue-2 mx-auto" />
      <p className="mt-4 text-gray-1">Cargando...</p>
    </div>
  </div>
);

const AppRouter = () => {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/productos" element={<Products />} />
                <Route
                  path="/sobre-nosotros"
                  element={
                    <div className="p-8">Sobre Nosotros en construcción</div>
                  }
                />
                <Route
                  path="/contacto"
                  element={<div className="p-8">Contacto en construcción</div>}
                />
                <Route
                  path="/pedidos"
                  element={
                    <div className="p-8">Mis Pedidos en construcción</div>
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
                  path="/profile"
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
          </main>
          <Footer />

          {/* Floating Cart Button */}
          <FloatingCartButton />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default AppRouter;
