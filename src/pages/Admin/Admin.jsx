import React from "react";
import { Hero } from "../../components/common";
import { Link } from "react-router-dom";

const Admin = () => {
  return (
    <div className="min-h-screen bg-gray-3">
      <div className="container mx-auto px-4 py-2">
        <Hero
          title="Panel de Administración"
          subtitle="Gestiona productos, pedidos y usuarios desde un solo lugar"
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow">
            <h3 className="text-xs md:text-sm font-medium text-gray-1 font-family-sora">
              Total Productos
            </h3>
            <p className="text-xl md:text-2xl font-bold text-blue-1 font-family-comfortaa mt-1 md:mt-2">
              127
            </p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-lg shadow">
            <h3 className="text-xs md:text-sm font-medium text-gray-1 font-family-sora">
              Pedidos Hoy
            </h3>
            <p className="text-xl md:text-2xl font-bold text-blue-1 font-family-comfortaa mt-1 md:mt-2">
              8
            </p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-lg shadow">
            <h3 className="text-xs md:text-sm font-medium text-gray-1 font-family-sora">
              Usuarios Registrados
            </h3>
            <p className="text-xl md:text-2xl font-bold text-blue-1 font-family-comfortaa mt-1 md:mt-2">
              342
            </p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-lg shadow">
            <h3 className="text-xs md:text-sm font-medium text-gray-1 font-family-sora">
              Ingresos del Mes
            </h3>
            <p className="text-xl md:text-2xl font-bold text-gold font-family-comfortaa mt-1 md:mt-2">
              $12,450
            </p>
          </div>
        </div>

        {/* Admin Shortcut Cards */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8 md:mb-10 px-2">
          {/* Shortcut Card */}
          <Link
            to="/admin/productos"
            className="bg-white rounded-xl shadow-lg px-4 md:px-8 py-5 md:py-7 w-full sm:w-auto sm:min-w-[240px] md:min-w-[260px] max-w-xs transition-all duration-300 cursor-pointer group hover:shadow-2xl hover:-translate-y-1 relative flex flex-col justify-center"
          >
            <span className="absolute left-0 top-0 h-full w-2.5 rounded-tl-xl rounded-bl-xl bg-gold group-hover:bg-blue-1 transition-all duration-300"></span>
            <div className="pl-3 md:pl-4">
              <h2 className="text-xl md:text-2xl font-bold text-gold font-family-comfortaa mb-1 md:mb-2 text-left group-hover:text-blue-1 transition-colors duration-300">
                Productos
              </h2>
              <p className="text-gold text-sm md:text-base font-family-sora text-left group-hover:text-blue-1 transition-colors duration-300">
                Gestionar productos del catálogo
              </p>
            </div>
          </Link>
          <Link
            to="/admin/usuarios"
            className="bg-white rounded-xl shadow-lg px-4 md:px-8 py-5 md:py-7 w-full sm:w-auto sm:min-w-[240px] md:min-w-[260px] max-w-xs transition-all duration-300 cursor-pointer group hover:shadow-2xl hover:-translate-y-1 relative flex flex-col justify-center"
          >
            <span className="absolute left-0 top-0 h-full w-2.5 rounded-tl-xl rounded-bl-xl bg-gold group-hover:bg-blue-1 transition-all duration-300"></span>
            <div className="pl-3 md:pl-4">
              <h2 className="text-xl md:text-2xl font-bold text-gold font-family-comfortaa mb-1 md:mb-2 text-left group-hover:text-blue-1 transition-colors duration-300">
                Usuarios
              </h2>
              <p className="text-gold text-sm md:text-base font-family-sora text-left group-hover:text-blue-1 transition-colors duration-300">
                Administrar usuarios registrados
              </p>
            </div>
          </Link>
          <Link
            to="/admin/pedidos"
            className="bg-white rounded-xl shadow-lg px-8 py-7 min-w-[260px] max-w-xs transition-all duration-300 cursor-pointer group hover:shadow-2xl hover:-translate-y-1 relative flex flex-col justify-center"
          >
            <span className="absolute left-0 top-0 h-full w-2.5 rounded-tl-xl rounded-bl-xl bg-gold group-hover:bg-blue-1 transition-all duration-300"></span>
            <div className="pl-4">
              <h2 className="text-2xl font-bold text-gold font-family-comfortaa mb-2 text-left group-hover:text-blue-1 transition-colors duration-300">
                Pedidos
              </h2>
              <p className="text-gold text-base font-family-sora text-left group-hover:text-blue-1 transition-colors duration-300">
                Gestionar y revisar pedidos
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Admin;
