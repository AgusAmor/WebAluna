import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";
import {
  FloatingCartButton,
  ProtectedRoute,
} from "../components/common/index.js";
import { AuthProvider } from "../context/AuthContext.jsx";

const Home = lazy(() => import("../pages/Home/index.js"));
const Products = lazy(() => import("../pages/Products/index.js"));
const Profile = lazy(() => import("../pages/Profile/index.js"));
const Admin = lazy(() => import("../pages/Admin/index.js"));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-2"></div>
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
