import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { FloatingCartButton } from "../components/common";

// Lazy loading de páginas para mejorar el tiempo de carga inicial
const Home = lazy(() => import("../pages/Home"));
const Products = lazy(() => import("../pages/Products"));
const Auth = lazy(() => import("../pages/Auth"));
const Profile = lazy(() => import("../pages/Profile"));
const Admin = lazy(() => import("../pages/Admin"));

// Componente de carga mientras se cargan las páginas
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-azul-2"></div>
      <p className="mt-4 text-gris-1">Cargando...</p>
    </div>
  </div>
);

const AppRouter = () => {
  return (
    <Router basename={import.meta.env.BASE_URL}>
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
                element={<div className="p-8">Mis Pedidos en construcción</div>}
              />
              <Route path="/auth" element={<Auth />} />
              <Route path="/perfil" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
              <Route
                path="*"
                element={
                  <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold mb-4">404</h1>
                      <p className="text-gris-1">Página no encontrada</p>
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
    </Router>
  );
};

export default AppRouter;
