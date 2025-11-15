import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { fetchProducts } from "../../services/firebaseProductService";
import { useCart } from "../../context/CartContext";
import { Hero } from "../../components/common";
import { ProductCard } from "../../components/ui";
import ProductDetailModal from "../../components/ui/ProductDetailModal";

const Products = () => {
  const { addItem } = useCart();
  const location = useLocation();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState("all");
  const [priceSort, setPriceSort] = useState("none");

  // State to store products fetched from backend
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from backend on mount
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const products = await fetchProducts();
        setAllProducts(products);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Open product modal if navigated from Home
  useEffect(() => {
    if (location.state && location.state.openProduct) {
      setSelectedProduct(location.state.openProduct);
      // Clear navigation state so modal doesn't reopen on refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location.state]);

  const families = ["all", ...new Set(allProducts.map((p) => p.family))];

  const filteredProducts = allProducts
    .filter(
      (product) => selectedFamily === "all" || product.family === selectedFamily
    )
    .sort((a, b) => {
      const priceA = a.pricing?.normal?.price ?? 0;
      const priceB = b.pricing?.normal?.price ?? 0;
      if (priceSort === "asc") return priceA - priceB;
      if (priceSort === "desc") return priceB - priceA;
      return 0;
    });

  const handleAddToCart = (product) => {
    addItem(product);
  };

  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setImgLoaded(false);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-3">
      <div className="max-w-[95%] mx-auto px-4 py-8">
        {/* Hero section */}
        <Hero
          title="Catálogo de Productos"
          subtitle="Descubre nuestra colección de lámparas únicas con impresión 3D"
        />

        {/* Filters section */}
        <div className="flex flex-wrap gap-4 mb-8 p-6 bg-white rounded-xl shadow-md">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold mb-2 text-blue-1 font-family-comfortaa">
              Familia de Producto
            </label>
            <select
              value={selectedFamily}
              onChange={(e) => setSelectedFamily(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-2 rounded-lg text-sm md:text-base font-family-sora focus:outline-none focus:ring-2 focus:ring-blue-2 focus:border-blue-2 bg-white text-blue-1 cursor-pointer transition-all"
            >
              <option value="all">Todas las colecciones</option>
              {families.slice(1).map((family) => (
                <option key={family} value={family}>
                  {family}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold mb-2 text-blue-1 font-family-comfortaa">
              Ordenar por Precio
            </label>
            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-2 rounded-lg text-sm md:text-base font-family-sora focus:outline-none focus:ring-2 focus:ring-blue-2 focus:border-blue-2 bg-white text-blue-1 cursor-pointer transition-all"
            >
              <option value="none">Sin ordenar</option>
              <option value="asc">Menor a Mayor</option>
              <option value="desc">Mayor a Menor</option>
            </select>
          </div>

          {/* Results counter */}
          <div className="w-full mt-2">
            <p className="text-sm text-gray-1 font-family-sora">
              Mostrando{" "}
              <span className="font-bold text-blue-2">
                {filteredProducts.length}
              </span>{" "}
              productos
            </p>
          </div>
        </div>

        {/* Loading and error states */}
        {loading && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-1 font-family-sora">
              Loading products...
            </p>
          </div>
        )}
        {error && (
          <div className="text-center py-16">
            <p className="text-xl text-red-500 font-family-sora">{error}</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onCardClick={handleCardClick}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-1 font-family-sora">
              No se encontraron productos con los filtros seleccionados
            </p>
          </div>
        )}
      </div>

      {/* Modal for Product Details */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto font-family-sora backdrop-blur-sm"
          style={{ backgroundColor: "rgba(38,78,96,0.45)" }}
          onClick={closeModal}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <ProductDetailModal
              product={selectedProduct}
              isOpen={!!selectedProduct}
              onClose={closeModal}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
