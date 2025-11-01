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
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 font-family-comfortaa">
            Lámparas impresas en 3D, hechas con intención.
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 font-family-sora">
            Explorá nuestras colecciones y encontrá la lámpara perfecta para
            vos.
          </p>

          <Link
            to="/productos"
            className="inline-block bg-blanco text-azul-2 px-6 py-2 md:px-8 md:py-3 text-base md:text-lg rounded-lg font-semibold hover:bg-dorado hover:text-blanco hover:scale-105 transition-all font-family-sora"
          >
            Ver Catálogo
          </Link>
        </div>
      </section>

      {/* Featured Products - Infinite Carousel */}
      <section className="py-16 bg-gris-3">
        <div className="container mx-auto px-4 mb-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 font-family-comfortaa">
              Productos Destacados
            </h2>
            <p className="text-base md:text-lg text-gris-1 font-family-sora">
              Hacé click en cualquier producto para ver el catálogo completo
            </p>
          </div>
        </div>

        <div
          className="carousel-container"
          aria-label="Carrusel de lámparas 3D destacadas"
        >
          <div className="carousel">
            {[
              ...sampleProducts,
              ...sampleProducts,
              ...sampleProducts,
              ...sampleProducts,
            ].map((product, index) => (
              <div
                key={index}
                className="carousel-item"
                onClick={goCatalog}
                role="button"
                tabIndex={0}
                aria-label={`Ver ${product.name} - Lámpara 3D personalizada`}
              >
                {product.imageBase64 ? (
                  <img
                    src={`data:image/jpeg;base64,${product.imageBase64}`}
                    alt={`${product.name} - Lámpara impresa en 3D - Aluna`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-azul-3 to-azul-2 flex items-center justify-center">
                    <div className="text-center text-blanco p-4">
                      <h3 className="text-lg md:text-xl font-bold mb-2">
                        {product.name} 3D
                      </h3>
                      <p className="text-base md:text-lg">${product.price}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-16 bg-blanco">
        <div className="container mx-auto px-4 max-w-4xl">
          <article className="text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 font-family-comfortaa text-azul-1">
              ¿Por qué elegir lámparas 3D de Aluna?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-3 font-family-comfortaa text-azul-2">
                  🎨 Diseños Únicos
                </h3>
                <p className="text-sm md:text-base text-gris-1 font-family-sora">
                  Cada lámpara 3D es única. Nuestros diseños personalizados
                  combinan tecnología de impresión 3D con creatividad artesanal.
                </p>
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-3 font-family-comfortaa text-azul-2">
                  🏭 Impresión 3D de Calidad
                </h3>
                <p className="text-sm md:text-base text-gris-1 font-family-sora">
                  Utilizamos tecnología de impresión 3D de última generación
                  para crear lámparas duraderas y con acabados perfectos.
                </p>
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-3 font-family-comfortaa text-azul-2">
                  📦 Envíos a toda Argentina
                </h3>
                <p className="text-sm md:text-base text-gris-1 font-family-sora">
                  Comprá online y recibí tu lámpara 3D personalizada en la
                  comodidad de tu hogar. Envíos seguros a todo el país.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
};

export default Home;
