import React from "react";

const Admin = () => {
  return (
    <div className="min-h-screen bg-gris-3">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 font-family-comfortaa text-azul-1">
          Panel de Administración
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blanco p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gris-1 font-family-sora">
              Total Productos
            </h3>
            <p className="text-2xl font-bold text-azul-1 font-family-comfortaa">
              127
            </p>
          </div>
          <div className="bg-blanco p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gris-1 font-family-sora">
              Pedidos Hoy
            </h3>
            <p className="text-2xl font-bold text-azul-1 font-family-comfortaa">
              8
            </p>
          </div>
          <div className="bg-blanco p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gris-1 font-family-sora">
              Usuarios Registrados
            </h3>
            <p className="text-2xl font-bold text-azul-1 font-family-comfortaa">
              342
            </p>
          </div>
          <div className="bg-blanco p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gris-1 font-family-sora">
              Ingresos del Mes
            </h3>
            <p className="text-2xl font-bold text-dorado font-family-comfortaa">
              $12,450
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Management */}
          <div className="bg-blanco rounded-lg shadow">
            <div className="p-6 border-b border-gris-2">
              <h2 className="text-xl font-semibold font-family-comfortaa text-azul-1">
                Gestión de Productos
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <button className="w-full bg-azul-2 text-blanco py-2 px-4 rounded-lg hover:bg-dorado transition-colors font-family-sora font-semibold">
                  Agregar Nuevo Producto
                </button>
                <button className="w-full bg-gris-3 text-azul-1 py-2 px-4 rounded-lg hover:bg-gris-2 transition-colors font-family-sora">
                  Ver Todos los Productos
                </button>
                <button className="w-full bg-gris-3 text-azul-1 py-2 px-4 rounded-lg hover:bg-gris-2 transition-colors font-family-sora">
                  Gestionar Categorías
                </button>
              </div>
            </div>
          </div>

          {/* Order Management */}
          <div className="bg-blanco rounded-lg shadow">
            <div className="p-6 border-b border-gris-2">
              <h2 className="text-xl font-semibold font-family-comfortaa text-azul-1">
                Gestión de Pedidos
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <button className="w-full bg-dorado text-negro py-2 px-4 rounded-lg hover:bg-azul-2 hover:text-blanco transition-colors font-family-sora font-semibold">
                  Pedidos Pendientes (5)
                </button>
                <button className="w-full bg-gris-3 text-azul-1 py-2 px-4 rounded-lg hover:bg-gris-2 transition-colors font-family-sora">
                  Historial de Pedidos
                </button>
                <button className="w-full bg-gris-3 text-azul-1 py-2 px-4 rounded-lg hover:bg-gris-2 transition-colors font-family-sora">
                  Reportes de Ventas
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
