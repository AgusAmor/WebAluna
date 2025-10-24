import React from "react";
import { useCart } from "../../context/CartContext";
import { Alert, Badge } from "flowbite-react";

const Home = () => {
  const { addItem } = useCart();

  const sampleProducts = [
    { id: 1, name: "Lámpara Luna", price: 150, image: null },
    { id: 2, name: "Lámpara Estrella", price: 200, image: null },
    { id: 3, name: "Lámpara Nebulosa", price: 250, image: null },
  ];

  const handleAddToCart = (product) => {
    addItem(product);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Bienvenido a Aluna</h1>
          <p className="text-xl mb-8">
            Lámparas únicas con impresión 3D. Tecnología y creatividad
            artesanal.
          </p>

          {/* Flowbite Alert Test */}
          <div className="mb-6">
            <Alert color="success" className="max-w-md mx-auto">
              <span className="font-medium">¡Flowbite funciona!</span> Este es
              un Alert de Flowbite React.
            </Alert>
          </div>

          <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Ver Catálogo
          </button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Productos Destacados</h2>
            {/* Flowbite Badge Test */}
            <Badge color="purple" size="lg">
              Powered by Flowbite React
            </Badge>
          </div>
          {/* Productos con funcionalidad de carrito */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sampleProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600 mt-2">
                  Diseño único con impresión 3D
                </p>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-xl font-bold">${product.price}</p>
                  <Badge color="info">Nuevo</Badge>
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Agregar al Carrito
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
