import { useCart } from "../../context/CartContext";

const Products = () => {
  const { addItem } = useCart();

  // Productos de ejemplo
  const products = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `Lámpara Moderna ${i + 1}`,
    price: (i + 1) * 75 + 50,
    description: "Diseño exclusivo con impresión 3D",
    imageBase64: null,
  }));

  const handleAddToCart = (product) => {
    addItem(product);
  };

  return (
    <div className="min-h-screen bg-gris-3">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 font-family-comfortaa">
            Catálogo de Productos
          </h1>
          <p className="text-base md:text-lg text-gris-1 font-family-sora">
            Descubre nuestra colección de lámparas únicas con impresión 3D
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 p-4 bg-blanco rounded-lg shadow">
          <select className="px-4 py-2 border rounded-lg text-sm md:text-base">
            <option>Todas las categorías</option>
            <option>Lámparas de Mesa</option>
            <option>Lámparas Colgantes</option>
            <option>Lámparas de Piso</option>
          </select>
          <select className="px-4 py-2 border rounded-lg text-sm md:text-base">
            <option>Precio</option>
            <option>Menor a Mayor</option>
            <option>Mayor a Menor</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-blanco rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="bg-gris-2 h-48"></div>
              <div className="p-4">
                <h3 className="font-semibold text-base md:text-lg mb-2 font-family-comfortaa">
                  {product.name}
                </h3>
                <p className="text-gris-1 text-sm md:text-base mb-3 font-family-sora">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg md:text-xl font-bold font-family-sora">
                    ${product.price}
                  </span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-azul-2 text-blanco px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base rounded-lg hover:bg-azul-1 transition-colors font-family-sora"
                  >
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
