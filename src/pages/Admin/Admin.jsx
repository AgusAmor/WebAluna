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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-1 font-family-sora">
              Total Productos
            </h3>
            <p className="text-2xl font-bold text-blue-1 font-family-comfortaa">
              127
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-1 font-family-sora">
              Pedidos Hoy
            </h3>
            <p className="text-2xl font-bold text-blue-1 font-family-comfortaa">
              8
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-1 font-family-sora">
              Usuarios Registrados
            </h3>
            <p className="text-2xl font-bold text-blue-1 font-family-comfortaa">
              342
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-1 font-family-sora">
              Ingresos del Mes
            </h3>
            <p className="text-2xl font-bold text-gold font-family-comfortaa">
              $12,450
            </p>
          </div>
        </div>

        {/* Admin Shortcut Cards */}
        <div className="flex flex-wrap justify-center gap-8 mb-10">
          {/* Shortcut Card */}
          <Link
            to="/admin/productos"
            className="bg-white rounded-xl shadow-lg px-8 py-7 min-w-[260px] max-w-xs transition-all duration-300 cursor-pointer group hover:shadow-2xl hover:-translate-y-1 relative flex flex-col justify-center"
          >
            <span className="absolute left-0 top-0 h-full w-2.5 rounded-tl-xl rounded-bl-xl bg-gold group-hover:bg-blue-1 transition-all duration-300"></span>
            <div className="pl-4">
              <h2 className="text-2xl font-bold text-gold font-family-comfortaa mb-2 text-left group-hover:text-blue-1 transition-colors duration-300">
                Productos
              </h2>
              <p className="text-gold text-base font-family-sora text-left group-hover:text-blue-1 transition-colors duration-300">
                Gestionar productos del catálogo
              </p>
            </div>
          </Link>
          <Link
            to="/admin/usuarios"
            className="bg-white rounded-xl shadow-lg px-8 py-7 min-w-[260px] max-w-xs transition-all duration-300 cursor-pointer group hover:shadow-2xl hover:-translate-y-1 relative flex flex-col justify-center"
          >
            <span className="absolute left-0 top-0 h-full w-2.5 rounded-tl-xl rounded-bl-xl bg-gold group-hover:bg-blue-1 transition-all duration-300"></span>
            <div className="pl-4">
              <h2 className="text-2xl font-bold text-gold font-family-comfortaa mb-2 text-left group-hover:text-blue-1 transition-colors duration-300">
                Usuarios
              </h2>
              <p className="text-gold text-base font-family-sora text-left group-hover:text-blue-1 transition-colors duration-300">
                Administrar usuarios registrados
              </p>
            </div>
          </Link>
          <div className="bg-white rounded-xl shadow-lg px-8 py-7 min-w-[260px] max-w-xs transition-all duration-300 cursor-pointer group hover:shadow-2xl hover:-translate-y-1 relative">
            <span className="absolute left-0 top-0 h-full w-[10px] rounded-tl-xl rounded-bl-xl bg-gold group-hover:bg-blue-1 transition-all duration-300"></span>
            <div className="pl-4">
              <h2 className="text-2xl font-bold text-gold font-family-comfortaa mb-2 text-left group-hover:text-blue-1 transition-colors duration-300">
                Pedidos
              </h2>
              <p className="text-gold text-base font-family-sora text-left group-hover:text-blue-1 transition-colors duration-300">
                Gestionar y revisar pedidos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
