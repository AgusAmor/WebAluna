import React from "react";

const Profile = () => {
  return (
    <div className="min-h-screen bg-gris-3">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 font-family-comfortaa">
          Mi Perfil
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <div className="bg-blanco rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 font-family-comfortaa">
                Información Personal
              </h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg"
                      defaultValue="Juan Pérez"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Apellido
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg"
                      defaultValue="García"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border rounded-lg"
                    defaultValue="juan.perez@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border rounded-lg"
                    defaultValue="+54 11 1234-5678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Dirección
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-lg"
                    rows="3"
                    defaultValue="Av. Corrientes 1234, CABA, Argentina"
                  />
                </div>

                <button className="bg-azul-2 text-blanco py-2 px-6 rounded-lg hover:bg-azul-1 transition-colors">
                  Guardar Cambios
                </button>
              </form>
            </div>
          </div>

          {/* Order History */}
          <div className="lg:col-span-1">
            <div className="bg-blanco rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 font-family-comfortaa">
                Mis Pedidos
              </h2>
              <div className="space-y-4">
                {[1, 2, 3].map((order) => (
                  <div key={order} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">Pedido #{order}001</span>
                      <span className="text-sm text-dorado">Entregado</span>
                    </div>
                    <p className="text-sm text-gris-1 mb-2">
                      2 productos - $450
                    </p>
                    <p className="text-xs text-gris-1">
                      Fecha: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                ))}

                <button className="w-full text-azul-2 py-2 text-sm hover:underline">
                  Ver todos los pedidos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
