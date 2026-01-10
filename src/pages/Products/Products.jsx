import { Hero } from "../../components/common";
import { ProductCard } from "../../components/ui";
import ProductDetailModal from "../../components/ui/ProductDetailModal";
import { useProducts } from "../../hooks";
import { ImSpinner2 } from "react-icons/im";

const Products = () => {
  const {
    filteredProducts,
    loading,
    error,
    families,
    selectedFamily,
    priceSort,
    selectedProduct,
    handleAddToCart,
    handleCardClick,
    handleCloseModal,
    handleFamilyChange,
    handlePriceSortChange,
  } = useProducts();

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
              onChange={(e) => handleFamilyChange(e.target.value)}
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
              onChange={(e) => handlePriceSortChange(e.target.value)}
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
          <div className="text-center py-16 flex flex-col items-center gap-4">
            <ImSpinner2 className="animate-spin h-12 w-12 text-blue-2" />
            <p className="text-xl text-gray-1 font-family-sora">
              Cargando productos...
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
          onClick={handleCloseModal}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <ProductDetailModal
              product={selectedProduct}
              isOpen={!!selectedProduct}
              onClose={handleCloseModal}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
