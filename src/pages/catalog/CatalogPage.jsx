import { Hero } from "../../components/Hero/Hero";
import { useState, useEffect } from "react";
import "./catalog.css";

export function CatalogPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/products")
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

  return (
    <div className="catalog-container">
      <Hero title="Catálogo" subtitle="Hechá un vistazo a nuestros productos" />

      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <div className="product-grid">
          {productos.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={product.img}
                alt={product.name}
                className="product-image"
              />
              <h3>{product.name}</h3>
              <p className="product-family">{product.family}</p>
              <p className="product-price">${product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
