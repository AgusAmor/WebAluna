import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./Carousel.css";

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
      <section className="bg-linear-to-r from-azul-2 to-azul-1 text-blanco py-20 h-96 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 font-family-comfortaa">
            Lámparas impresas en 3D, hechas con intención.
          </h1>
          <p className="text-xl mb-8 font-family-sora">
            Explorá nuestras colecciones y encontrá la lámpara perfecta para
            vos.
          </p>

          <Link
            to="/productos"
            className="inline-block bg-blanco text-azul-2 px-8 py-3 rounded-lg font-semibold hover:bg-gris-3 transition-colors font-family-sora"
          >
            Ver Catálogo
          </Link>
        </div>
      </section>

      {/* Featured Products - Infinite Carousel */}
      <section className="py-16 bg-gris-3">
        <div className="container mx-auto px-4 mb-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 font-family-comfortaa">
              Productos Destacados
            </h2>
            <p className="text-gris-1 font-family-sora">
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
                  <div className="w-full h-full bg-linear-to-br from-azul-3 to-azul-2 flex items-center justify-center">
                    <div className="text-center text-blanco p-4">
                      <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                      <p className="text-lg">${product.price}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
