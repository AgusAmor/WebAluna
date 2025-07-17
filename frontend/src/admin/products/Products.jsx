import { useEffect, useRef, useState } from "react";
import { Hero } from "../../components/hero/Hero";
import "./products.css";

export function Products() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef(null);

  const initialForm = {
    name: "",
    price: "",
    family: "AENOR",
    img: "",
    size: "DEFAULT",
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);

    setFormData({
      name: product.name || "",
      price: product.price || "",
      family: product.family || "AENOR",
      size: product.size || "DEFAULT",
      img: `data:image/jpeg;base64,${product.imageBase64}` || "",
      imageBase64: product.imageBase64 || "",
    });

    setShowForm(true);

    setTimeout(
      () => formRef.current?.scrollIntoView({ behavior: "smooth" }),
      100
    );
  };

  const handleDelete = (id) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    fetch(`http://localhost:5000/products/${id}`, {
      method: "DELETE",
    })
      .then(() => setProducts(products.filter((p) => p.id !== id)))
      .catch((err) => console.error("Error al borrar:", err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const method = selectedProduct ? "PUT" : "POST";
    const url = selectedProduct
      ? `http://localhost:5000/products/${selectedProduct.id}`
      : `http://localhost:5000/products`;

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
    setTimeout(
      () => formRef.current?.scrollIntoView({ behavior: "smooth" }),
      100
    );
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
                  <img
                    src={`data:image/jpeg;base64,${p.imageBase64}`}
                    alt={p.name}
                    style={{ width: "60px" }}
                  />
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
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="product-form"
            id="edit-form"
          >
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
                if (!file) return;

                const reader = new FileReader();
                reader.onloadend = () => {
                  setFormData((prev) => ({
                    ...prev,
                    img: reader.result,
                    imageBase64: reader.result.split(",")[1],
                  }));
                };
                reader.readAsDataURL(file);
              }}
            />

            {formData.imageBase64 && (
              <img
                src={`data:image/jpeg;base64,${formData.imageBase64}`}
                alt={formData.name}
                style={{ width: "50%", margin: "0px 25%" }}
              />
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
