import { useEffect, useState } from "react";
import { Hero } from "../../components/hero/Hero";
import "./products.css";

export function Products() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const initialForm = {
    name: "",
    price: "",
    family: "AENOR",
    img: "",
    size: "DEFAULT",
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData(product);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    fetch(`http://localhost:3000/products/${id}`, {
      method: "DELETE",
    })
      .then(() => setProducts(products.filter((p) => p.id !== id)))
      .catch((err) => console.error("Error al borrar:", err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const method = selectedProduct ? "PUT" : "POST";
    const url = selectedProduct
      ? `http://localhost:3000/products/${selectedProduct.id}`
      : `http://localhost:3000/products`;

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((savedProduct) => {
        if (selectedProduct) {
          setProducts(
            products.map((p) => (p.id === savedProduct.id ? savedProduct : p))
          );
        } else {
          setProducts([...products, savedProduct]);
        }

        setFormData(initialForm);
        setSelectedProduct(null);
        setShowForm(false);
      })
      .catch((err) => console.error("Error al guardar:", err));
  };

  const handleAddNew = () => {
    setFormData(initialForm);
    setSelectedProduct(null);
    setShowForm(true);
  };

  return (
    <div className="container">
      <Hero title="Productos" subtitle="Gestión de productos" />
      <div className="product-manager">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Familia</th>
              <th>Tamaño</th>
              <th>Imagen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>{p.family}</td>
                <td>{p.size}</td>
                <td>
                  <img src={p.img} alt={p.name} style={{ width: "60px" }} />
                </td>
                <td>
                  <button onClick={() => handleEdit(p)}>Modificar</button>
                  <button onClick={() => handleDelete(p.id)}>Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="add-product-btn" onClick={handleAddNew}>
          Agregar nuevo producto
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="product-form">
            <h3>
              {selectedProduct ? "Modificar producto" : "Agregar producto"}
            </h3>

            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nombre"
              required
            />
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="Precio"
              required
            />
            <select
              name="family"
              value={formData.family}
              onChange={handleChange}
              required
            >
              <option value="AENOR">AENOR</option>
              <option value="CORE">CORE</option>
            </select>

            <select
              name="size"
              value={formData.size}
              onChange={handleChange}
              required
            >
              <option value="DEFAULT">DEFAULT</option>
              <option value="SMALL">SMALL</option>
            </select>

            <input
              type="file"
              name="img"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const imageUrl = URL.createObjectURL(file);
                  setFormData({
                    ...formData,
                    img: imageUrl,
                  });
                }
              }}
            />

            {formData.img && (
              <div className="preview">
                <img src={formData.img} alt="Preview" height="100" />
              </div>
            )}

            <button type="submit">
              {selectedProduct ? "Guardar cambios" : "Crear producto"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
