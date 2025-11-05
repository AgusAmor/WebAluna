import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { Hero } from "../../components/common";
import { ProductCard } from "../../components/ui";

const Products = () => {
  const { addItem } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState("all");
  const [priceSort, setPriceSort] = useState("none");

  const allProducts = [
    {
      id: 1,
      name: "Lámpara Luna",
      price: 150,
      family: "AENOR",
      size: "15cm x 20cm",
      imageBase64: null,
    },
    {
      id: 2,
      name: "Lámpara Estrella",
      price: 200,
      family: "AENOR",
      size: "18cm x 25cm",
      imageBase64: null,
    },
    {
      id: 3,
      name: "Lámpara Nebulosa",
      price: 180,
      family: "AENOR",
      size: "20cm x 30cm",
      imageBase64: null,
    },
    {
      id: 4,
      name: "Lámpara Sol",
      price: 220,
      family: "AENOR",
      size: "15cm x 28cm",
      imageBase64: null,
    },
    {
      id: 5,
      name: "Lámpara Minimal 1",
      price: 130,
      family: "CORE",
      size: "12cm x 18cm",
      imageBase64: null,
    },
    {
      id: 6,
      name: "Lámpara Minimal 2",
      price: 160,
      family: "CORE",
      size: "14cm x 20cm",
      imageBase64: null,
    },
    {
      id: 7,
      name: "Lámpara Minimal 3",
      price: 250,
      family: "CORE",
      size: "22cm x 35cm",
      imageBase64: null,
    },
    {
      id: 8,
      name: "Lámpara Minimal 4",
      price: 190,
      family: "CORE",
      size: "16cm x 24cm",
      imageBase64: null,
    },
  ];

  const families = ["all", ...new Set(allProducts.map((p) => p.family))];

  const filteredProducts = allProducts
    .filter(
      (product) => selectedFamily === "all" || product.family === selectedFamily
    )
    .sort((a, b) => {
      if (priceSort === "asc") return a.price - b.price;
      if (priceSort === "desc") return b.price - a.price;
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
        {/* Hero */}
        <Hero
          title="Catálogo de Productos"
          subtitle="Descubre nuestra colección de lámparas únicas con impresión 3D"
        />

        {/* Filters */}
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

        {/* Products Grid */}
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

        {/* No results message */}
        {filteredProducts.length === 0 && (
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
          className="fixed inset-0 w-screen h-screen backdrop-blur-sm flex items-center justify-center z-9999"
          style={{ backgroundColor: "rgba(38,78,96,0.45)" }}
          onClick={closeModal}
        >
          <div
            className="max-w-[420px] w-[90%] p-8 rounded-2xl overflow-hidden bg-white animate-fadeInScale"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image - Square */}
            {selectedProduct.imageBase64 ? (
              <img
                src={`data:image/jpeg;base64,${selectedProduct.imageBase64}`}
                alt={selectedProduct.name}
                className="w-full aspect-square object-cover rounded-xl mb-4 transition-opacity duration-700"
                onLoad={() => setImgLoaded(true)}
                style={{ opacity: imgLoaded ? 1 : 0 }}
              />
            ) : (
              <div className="w-full aspect-square bg-linear-to-br from-blue-3 to-blue-2 rounded-xl mb-4 flex items-center justify-center">
                <span className="text-white">Sin imagen</span>
              </div>
            )}

            {/* Modal Info */}
            <h2 className="text-2xl font-black font-family-comfortaa text-blue-1 mb-2">
              {selectedProduct.name}
            </h2>
            <p className="text-blue-2 font-semibold mb-1 font-family-sora">
              {selectedProduct.family}
            </p>
            <p className="text-xl font-bold text-gold mb-2 font-family-comfortaa">
              ${selectedProduct.price}
            </p>
            <p className="text-gray-1 font-family-sora mb-4">
              Tamaño: {selectedProduct.size}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
