import React, { useState } from "react";
import { AddProductModal } from "../../components/common";
import { useAuth } from "../../context/AuthContext";
import productsService from "../../services/firebaseProductsService";

const Admin = () => {
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleAddProduct = async (productData) => {
    setIsLoading(true);
    try {
      console.log("Iniciando creación de producto:", {
        name: productData.name,
        family: productData.family,
        hasImage: !!productData.image,
        imageSize: productData.image?.size,
        createdBy: user?.uid,
      });

      const newProduct = await productsService.createProduct(
        productData,
        user?.uid
      );

      console.log("✅ Producto creado exitosamente:", {
        id: newProduct.id,
        name: newProduct.name,
        imageUrl: newProduct.image,
        pricing: newProduct.pricing,
      });

      // TODO: Mostrar notificación de éxito
      // TODO: Actualizar lista de productos si existe

      return newProduct; // Retornar para que el modal pueda usar la respuesta
    } catch (error) {
      console.error("❌ Error creating product:", {
        message: error.message,
        code: error.code,
        productName: productData.name,
      });
      // TODO: Mostrar notificación de error
      throw error; // Re-throw para que el modal maneje el error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-3">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 font-family-comfortaa text-blue-1">
          Panel de Administración
        </h1>

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Management */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-2">
              <h2 className="text-xl font-semibold font-family-comfortaa text-blue-1">
                Gestión de Productos
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="w-full bg-blue-2 text-white py-2 px-4 rounded-lg hover:bg-gold transition-colors font-family-sora font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Guardando..." : "Agregar Nuevo Producto"}
                </button>
                <button className="w-full bg-gray-3 text-blue-1 py-2 px-4 rounded-lg hover:bg-gray-2 transition-colors font-family-sora">
                  Ver Todos los Productos
                </button>
                <button className="w-full bg-gray-3 text-blue-1 py-2 px-4 rounded-lg hover:bg-gray-2 transition-colors font-family-sora">
                  Gestionar Categorías
                </button>
              </div>
            </div>
          </div>

          {/* Order Management */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-2">
              <h2 className="text-xl font-semibold font-family-comfortaa text-blue-1">
                Gestión de Pedidos
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <button className="w-full bg-gold text-black py-2 px-4 rounded-lg hover:bg-blue-2 hover:text-white transition-colors font-family-sora font-semibold">
                  Pedidos Pendientes (5)
                </button>
                <button className="w-full bg-gray-3 text-blue-1 py-2 px-4 rounded-lg hover:bg-gray-2 transition-colors font-family-sora">
                  Historial de Pedidos
                </button>
                <button className="w-full bg-gray-3 text-blue-1 py-2 px-4 rounded-lg hover:bg-gray-2 transition-colors font-family-sora">
                  Reportes de Ventas
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Add Product Modal */}
        <AddProductModal
          isOpen={showAddProductModal}
          onClose={() => setShowAddProductModal(false)}
          onSave={handleAddProduct}
        />
      </div>
    </div>
  );
};

export default Admin;
