import React from "react";

const Products = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Catálogo de Productos</h1>
          <p className="text-gray-600">
            Descubre nuestra colección de lámparas únicas con impresión 3D
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 p-4 bg-white rounded-lg shadow">
          <select className="px-4 py-2 border rounded-lg">
            <option>Todas las categorías</option>
            <option>Lámparas de Mesa</option>
            <option>Lámparas Colgantes</option>
            <option>Lámparas de Piso</option>
          </select>
          <select className="px-4 py-2 border rounded-lg">
            <option>Precio</option>
            <option>Menor a Mayor</option>
            <option>Mayor a Menor</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="bg-gray-200 h-48"></div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">
                  Lámpara Moderna {i + 1}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Diseño exclusivo con impresión 3D
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">
                    ${(i + 1) * 75 + 50}
                  </span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
