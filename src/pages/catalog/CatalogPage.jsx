import { Hero } from "../../components/hero/Hero";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
import "./catalog.css";

export function CatalogPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { isLogged } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => {
        setProductos(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar productos:", error);
        setLoading(false);
      });
  }, []);

  const handleCardClick = (product) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = (product) => {
    if (!isLogged) {
      toast.success("Debe iniciar sesión para agregar productos al carrito.", {
        icon: (
          <img
            src="../../public/img/iso.png"
            alt="iso"
            style={{ width: 24, height: 24 }}
          />
        ),
      });
    } else {
      addToCart(product);
      toast.success(product.name + " agregada al carrito.", {
        icon: (
          <img
            src="../../public/img/iso.png"
            alt="iso"
            style={{ width: 24, height: 24 }}
          />
        ),
      });
    }
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="catalog-container">
      <Hero title="Catálogo" subtitle="Conocé nuestros productos" />

      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <div className="product-grid">
          {productos.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => handleCardClick(product)}
            >
              <img
                src={`data:image/jpeg;base64,${product.imageBase64}`}
                alt={product.name}
                className="product-image"
              />
              <h3>{product.name}</h3>
              <p className="product-family">{product.family}</p>
              <p className="product-price">${product.price}</p>

              <button
                className="add-to-cart-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
              >
                Agregar al carrito
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={`data:image/jpeg;base64,${selectedProduct.imageBase64}`}
              alt={selectedProduct.name}
              className="modal-image"
              onLoad={() => setImgLoaded(true)}
              style={{
                opacity: imgLoaded ? 1 : 0,
                transition: "opacity 0.7s ease",
              }}
            />
            <h2>{selectedProduct.name}</h2>
            <p className="product-family">{selectedProduct.family}</p>
            <p className="product-price">${selectedProduct.price}</p>
            <p className="product-size">Tamaño: {selectedProduct.size}</p>
          </div>
        </div>
      )}
    </div>
  );
}
