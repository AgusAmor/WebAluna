import React, { useEffect, useState, useRef } from "react";
import { MdAdd } from "react-icons/md";
import { TiUpload } from "react-icons/ti";
import { Hero } from "../../components/common";
import {
  fetchProducts,
  createProduct,
  uploadProductImage,
  deleteProduct,
  updateProduct,
  replaceProductImage,
} from "../../services/firebaseProductService";
import { useAuth } from "../../context/AuthContext";
import ProductForm from "./ProductForm";

// ProductManagement component: handles product CRUD, modal state, and UI feedback for admin product management.
const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false); // New state for product creation
  const imageInputRef = useRef(null);
  const { user } = useAuth();
  const [deletingId, setDeletingId] = useState(null); // Track which product is being deleted
  const [editProduct, setEditProduct] = useState(null); // Producto en edición

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        setError("Error al cargar productos");
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-3 px-4 py-2 pb-20">
      <Hero
        title="Gestión de Productos"
        subtitle="Aquí podrás administrar los productos del catálogo."
      />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-4 mt-2">
          <button
            className="flex items-center gap-2 bg-gold text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-blue-2 hover:text-white transition-colors"
            onClick={() => setShowModal(true)}
          >
            <MdAdd size={22} />
            Agregar producto
          </button>
        </div>
        {/* Modal for adding or editing a product. Reuses ProductForm component. */}
        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowModal(false);
                setEditProduct(null);
                setImagePreview(null);
              }
            }}
          >
            <div
              className="bg-white rounded-xl shadow-lg p-8 w-full max-w-3xl min-w-[350px] relative h-[600px] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 text-blue-2 hover:text-gold text-xl font-bold"
                onClick={() => {
                  setShowModal(false);
                  setEditProduct(null);
                  setImagePreview(null);
                }}
                aria-label="Cerrar"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold text-blue-2 mb-4 font-family-comfortaa">
                {editProduct ? "Editar producto" : "Agregar producto"}
              </h2>
              <ProductForm
                initialProduct={editProduct}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
                saving={saving}
                error={error}
                buttonLabel={editProduct ? "Aplicar cambios" : "Guardar"}
                onCancel={() => {
                  setShowModal(false);
                  setEditProduct(null);
                  setImagePreview(null);
                }}
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (saving) return;
                  setError(null);
                  setSaving(true);
                  const form = e.target;
                  const name = form.elements["name"].value;
                  const description = form.elements["description"].value;
                  const family = form.elements["family"].value;
                  const normalPrice = form.elements["normalPrice"].value;
                  const normalSize = form.elements["normalSize"].value;
                  const smallPrice = form.elements["smallPrice"].value;
                  const smallSize = form.elements["smallSize"].value;
                  const fileInput = form.querySelector("#product-image-upload");
                  const file =
                    fileInput && fileInput.files && fileInput.files[0];
                  let imageUrl =
                    imagePreview || (editProduct && editProduct.imageUrl) || "";
                  let imageChanged = false;
                  if (file) {
                    try {
                      const uniqueName = `products/${Date.now()}_${Math.floor(
                        Math.random() * 10000
                      )}_${file.name}`;
                      if (editProduct && editProduct.imageUrl) {
                        // Use replaceProductImage to delete old image and upload new one
                        imageUrl = await replaceProductImage(
                          file,
                          uniqueName,
                          editProduct.imageUrl
                        );
                      } else {
                        imageUrl = await uploadProductImage(file, uniqueName);
                      }
                      imageChanged = true;
                    } catch (err) {
                      setError(
                        "Error uploading image: " + (err.message || err)
                      );
                      setSaving(false);
                      return;
                    }
                  } else if (!imageUrl) {
                    setError("Image is required");
                    setSaving(false);
                    return;
                  }
                  let token = "";
                  if (user && user.getIdToken) {
                    token = await user.getIdToken(true); // force refresh
                  } else if (
                    user &&
                    user.stsTokenManager &&
                    user.stsTokenManager.accessToken
                  ) {
                    token = user.stsTokenManager.accessToken;
                  }
                  if (!token) {
                    setError("User token not found. Please log in again.");
                    setSaving(false);
                    return;
                  }
                  const product = {
                    name,
                    description,
                    family,
                    price: Number(normalPrice),
                    imageUrl,
                    pricing: {
                      normal: { price: Number(normalPrice), size: normalSize },
                      small: { price: Number(smallPrice), size: smallSize },
                    },
                  };
                  try {
                    if (editProduct) {
                      await updateProduct(editProduct.id, product, token);
                      const data = await fetchProducts();
                      setProducts(data);
                    } else {
                      const result = await createProduct(product, token);
                      const data = await fetchProducts();
                      setProducts(data);
                    }
                    setShowModal(false);
                    setEditProduct(null);
                    setImagePreview(null);
                  } catch (err) {
                    setError(
                      err.message ||
                        (editProduct
                          ? "Error editing product"
                          : "Error creating product")
                    );
                  } finally {
                    setSaving(false);
                  }
                }}
              />
            </div>
          </div>
        )}
        {/* Product table */}
        <div className="bg-white rounded-xl shadow-md mt-2 overflow-x-auto">
          {loading ? (
            <div className="text-center py-8 text-blue-2 font-bold">
              Cargando productos...
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500 font-bold">
              {error}
            </div>
          ) : (
            <table className="min-w-full font-family-sora text-xs md:text-sm">
              <thead>
                <tr className="bg-gold text-white">
                  <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
                    Imagen
                  </th>
                  <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
                    Nombre
                  </th>
                  <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
                    Familia
                  </th>
                  <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
                    Precio Normal
                  </th>
                  <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
                    Precio Small
                  </th>
                  <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-2 hover:bg-gray-3/40"
                  >
                    <td className="py-2 px-2 text-center">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg mx-auto"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-2 flex items-center justify-center rounded-lg text-xs text-gray-3 mx-auto">
                          Sin imagen
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-2 font-bold text-blue-1 text-center">
                      {product.name}
                    </td>
                    <td className="py-2 px-2 text-center">
                      {product.family || "-"}
                    </td>
                    <td className="py-2 px-2 text-gold font-bold text-center">
                      ${product.pricing?.normal?.price ?? "-"}
                    </td>
                    <td className="py-2 px-2 text-gold font-bold text-center">
                      ${product.pricing?.small?.price ?? "-"}
                    </td>
                    <td className="py-2 px-2 text-center">
                      <div className="flex flex-col items-center gap-2">
                        {/* Edit button: opens modal with product data for editing. */}
                        <button
                          className="bg-blue-2 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-gold transition-colors w-24"
                          type="button"
                          onClick={() => {
                            setEditProduct(product);
                            setImagePreview(product.imageUrl || null);
                            setShowModal(true);
                          }}
                        >
                          Editar
                        </button>
                        {/* Delete button: removes product and image from Firestore/Storage. */}
                        <button
                          className={`bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-700 transition-colors w-24 flex items-center justify-center ${
                            deletingId === product.id
                              ? "opacity-60 cursor-not-allowed"
                              : ""
                          }`}
                          disabled={deletingId === product.id}
                          onClick={async () => {
                            if (deletingId) return;
                            setDeletingId(product.id);
                            setError(null);
                            let token = "";
                            if (user && user.getIdToken) {
                              token = await user.getIdToken(true); // force refresh
                            } else if (
                              user &&
                              user.stsTokenManager &&
                              user.stsTokenManager.accessToken
                            ) {
                              token = user.stsTokenManager.accessToken;
                            }
                            if (!token) {
                              setError(
                                "User token not found. Please log in again."
                              );
                              setDeletingId(null);
                              return;
                            }
                            try {
                              await deleteProduct(product.id, token);
                              // Eliminar imagen del storage si existe
                              if (product.imageUrl) {
                                try {
                                  const { deleteProductImage } = await import(
                                    "../../services/firebaseProductService"
                                  );
                                  await deleteProductImage(product.imageUrl);
                                } catch (imgErr) {
                                  console.error(
                                    "Error eliminando imagen del storage:",
                                    imgErr
                                  );
                                }
                              }
                              // Remove from UI
                              setProducts((prev) =>
                                prev.filter((p) => p.id !== product.id)
                              );
                            } catch (err) {
                              setError(err.message || "Error deleting product");
                            } finally {
                              setDeletingId(null);
                            }
                          }}
                        >
                          {deletingId === product.id ? (
                            <span className="flex items-center justify-center w-full h-full">
                              <svg
                                className="animate-spin h-5 w-5 mx-auto text-white"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-20"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  fill="none"
                                />
                                <path
                                  fill="currentColor"
                                  d="M12 2a10 10 0 0 1 10 10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </span>
                          ) : (
                            "Eliminar"
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
