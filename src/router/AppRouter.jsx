import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Home from "../pages/Home";
import { FloatingCartButton } from "../components/common";

const AppRouter = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/productos"
              element={<div className="p-8">Productos en construcción</div>}
            />
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
            <Route
              path="/auth"
              element={<div className="p-8">Auth en construcción</div>}
            />
            <Route
              path="/perfil"
              element={<div className="p-8">Perfil en construcción</div>}
            />
            <Route
              path="/admin"
              element={<div className="p-8">Admin en construcción</div>}
            />
            <Route
              path="*"
              element={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">404</h1>
                    <p className="text-gray-600">Página no encontrada</p>
                  </div>
                </div>
              }
            />
          </Routes>
        </main>
        <Footer />

        {/* Floating Cart Button */}
        <FloatingCartButton />
      </div>
    </Router>
  );
};

export default AppRouter;
