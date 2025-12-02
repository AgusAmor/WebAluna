import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { fetchProducts } from "../../services/firebaseProductService";
import "./Carousel.css";

const Home = () => {
  const navigate = useNavigate();
  const carouselRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch featured products from Firebase on component mount.
   * Handles loading and error states for products display.
   */
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const fetched = await fetchProducts();
        setProducts(fetched);
      } catch (err) {
        setError("No se pudieron cargar los productos");
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  /**
   * Infinite carousel effect with continuous horizontal scroll.
   * Uses requestAnimationFrame for smooth animation without CSS transitions.
   * Automatically resets scroll position when reaching the end of the product list
   * to create a seamless infinite loop effect.
   */
  useEffect(() => {
    if (loading || error || products.length === 0) return;

    const carousel = carouselRef.current;
    if (!carousel) return;

    // Calculate total width of one product item (width + gap)
    const itemWidth = 320 + 24; // 20rem (320px) + 1.5rem gap (24px)
    let scrollPos = 0;
    let animationId = null;

    /**
     * Scroll animation function using requestAnimationFrame.
     * Increments scroll position and resets when reaching end of duplicated products.
     */
    const scroll = () => {
      scrollPos += 0.4; // Scroll speed in pixels per frame

      // Reset scroll position when reaching the end of the product set for seamless loop
      if (scrollPos >= itemWidth * products.length) {
        scrollPos = 0;
      }

      carousel.style.transform = `translateX(-${scrollPos}px)`;
      animationId = requestAnimationFrame(scroll);
    };
    /**
     * Navigate to products catalog and optionally pre-select a specific product.
     * Used when user clicks on a featured product in the carousel.
     */
    const goToCatalog = (product) => {
      navigate("/productos", { state: { openProduct: product } });
    };
    animationId = requestAnimationFrame(scroll);

    // Cleanup: Cancel animation frame on unmount
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [products, loading, error]);

  const goToCatalog = (product) => {
    navigate("/productos", { state: { openProduct: product } });
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-blue-2 to-blue-1 text-white py-20 h-96 flex items-center justify-center">
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
            className="inline-block bg-white text-blue-2 px-6 py-2 md:px-8 md:py-3 text-base md:text-lg rounded-lg font-semibold hover:bg-gold hover:text-white hover:scale-105 transition-all font-family-sora"
          >
            Ver Catálogo
          </Link>
        </div>
      </section>

      {/* Featured Products - Infinite Carousel */}
      <section className="py-16 bg-gray-3">
        <div className="container mx-auto px-4 mb-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 font-family-comfortaa">
              Productos Destacados
            </h2>
            <p className="text-base md:text-lg text-gray-1 font-family-sora">
              Hacé click en cualquier producto para ver el catálogo completo
            </p>
          </div>
        </div>

        <div
          className="carousel-container"
          aria-label="Carrusel de lámparas 3D destacadas"
        >
          <div className="carousel" ref={carouselRef}>
            {loading ? (
              <div className="carousel-item flex items-center justify-center text-gray-2 text-lg">
                Cargando productos...
              </div>
            ) : error ? (
              <div className="carousel-item flex items-center justify-center text-red-500 text-lg">
                {error}
              </div>
            ) : (
              <>
                {/* Duplicar productos para efecto infinito sin reinicio */}
                {[...products, ...products].map((product, index) => (
                  <div
                    key={index}
                    className="carousel-item"
                    onClick={() => goToCatalog(product)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Ver ${product.name} - Lámpara 3D personalizada`}
                  >
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={`${product.name} - Lámpara impresa en 3D - Aluna`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-blue-3 to-blue-2 flex items-center justify-center">
                        <div className="text-center text-white p-4">
                          <h3 className="text-lg md:text-xl font-bold mb-2">
                            {product.name} 3D
                          </h3>
                          <p className="text-base md:text-lg">
                            $
                            {product.price ||
                              (product.pricing?.normal?.price ?? "")}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <article className="text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 font-family-comfortaa text-blue-1">
              ¿Por qué elegir nuestras lámparas 3D para tu hogar?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-3 font-family-comfortaa text-blue-2">
                  Diseño Único y Personalizado
                </h3>
                <p className="text-sm md:text-base text-gray-1 font-family-sora">
                  Cada lámpara decorativa que creamos para vos está hecha con
                  filamento ecológico y atención artesanal al detalle. Tu
                  lámpara 3D será una pieza única que refleja calidad y
                  dedicación en cada acabado.
                </p>
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-3 font-family-comfortaa text-blue-2">
                  Transformá tu Espacio
                </h3>
                <p className="text-sm md:text-base text-gray-1 font-family-sora">
                  Nuestras lámparas de diseño no solo iluminan, transforman tu
                  ambiente en un lugar acogedor. Creá la atmósfera perfecta en
                  tu hogar con iluminación decorativa que invita a quedarte y
                  disfrutar cada momento.
                </p>
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-3 font-family-comfortaa text-blue-2">
                  Tecnología y Arte para Vos
                </h3>
                <p className="text-sm md:text-base text-gray-1 font-family-sora">
                  Combinamos impresión 3D de última generación con diseño
                  artesanal. Obtenés piezas decorativas modernas y elegantes con
                  el toque humano que solo el trabajo artesanal puede darle a tu
                  decoración.
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
