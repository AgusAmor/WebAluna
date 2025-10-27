import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { useCart } from "../../context/CartContext";
import { Button } from "flowbite-react";

const Home = () => {
  const { addItem } = useCart();
  const navigate = useNavigate();

  const sampleProducts = [
    { id: 1, name: "Lámpara Luna", price: 150, imageBase64: null },
    { id: 2, name: "Lámpara Estrella", price: 200, imageBase64: null },
    { id: 3, name: "Lámpara Nebulosa", price: 250, imageBase64: null },
  ];

  const handleAddToCart = (product) => {
    addItem(product);
  };

  const goCatalog = () => {
    navigate("/productos");
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-purple-600 to-blue-600 text-white py-20 h-96 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Lámparas impresas en 3D, hechas con intención.
          </h1>
          <p className="text-xl mb-8">
            Explorá nuestras colecciones y encontrá la lámpara perfecta para
            vos.
          </p>

          <Button className="bg-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors justify-self-center">
            <Link to="/productos">Ver Catálogo</Link>
          </Button>
        </div>
      </section>

      {/* Featured Products - Infinite Carousel */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 mb-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Productos Destacados</h2>
            <p className="text-gray-600">
              Hacé click en cualquier producto para ver el catálogo completo
            </p>
          </div>
        </div>

        <div className="carousel-container">
          <div className="carousel">
            {[
              ...sampleProducts,
              ...sampleProducts,
              ...sampleProducts,
              ...sampleProducts,
            ].map((product, index) => (
              <div key={index} className="carousel-item" onClick={goCatalog}>
                {product.imageBase64 ? (
                  <img
                    src={`data:image/jpeg;base64,${product.imageBase64}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                    <div className="text-center text-white p-4">
                      <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                      <p className="text-lg">${product.price}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CSS para el carousel */}
        <style>{`
          .carousel-container {
            max-width: 1200px;
            margin: 0 auto;
            overflow: hidden;
            padding: 2rem 0;
          }

          .carousel {
            display: flex;
            gap: 1.5rem;
            animation: scroll-carousel 25s linear infinite;
            will-change: transform;
          }

          .carousel-item {
            flex-shrink: 0;
            width: 16rem;
            height: 16rem;
            border-radius: 0.5rem;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            transition: all 0.3s ease-out;
          }

          .carousel-item:hover {
            transform: scale(1.1);
            box-shadow: 0 20px 25px rgba(0, 0, 0, 0.2);
            z-index: 10;
          }

          .carousel-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          @keyframes scroll-carousel {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(calc(-17.5rem * ${sampleProducts.length}));
            }
          }
        `}</style>
      </section>
    </main>
  );
};

export default Home;
