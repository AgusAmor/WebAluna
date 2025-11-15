import React, { useEffect, useState, useRef } from "react";
import { MdAdd } from "react-icons/md";
import { TiUpload } from "react-icons/ti";
import { Hero } from "../../components/common";
import { fetchProducts } from "../../services/firebaseProductService";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const imageInputRef = useRef(null);

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
    <div className="min-h-screen bg-gray-3 px-4 py-2">
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
        {/* Modal para agregar producto */}
        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowModal(false);
            }}
          >
            <div
              className="bg-white rounded-xl shadow-lg p-8 w-full max-w-3xl min-w-[350px] relative h-[600px] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 text-blue-2 hover:text-gold text-xl font-bold"
                onClick={() => setShowModal(false)}
                aria-label="Cerrar"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold text-blue-2 mb-4 font-family-comfortaa">
                Agregar producto
              </h2>
              {/* Form for adding a product. Reset on cancel. */}
              <form
                className="space-y-4 overflow-y-auto flex-1"
                id="add-product-form"
              >
                <div className="flex flex-col gap-4">
                  <label className="font-bold text-blue-2 mb-1 flex items-center gap-1">
                    Nombre <span className="text-gold">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre"
                    required
                    className="w-full px-4 py-2 border border-gray-2 rounded-lg focus:border-gold focus:outline-none"
                  />
                  <label className="font-bold  text-blue-2 mb-1 flex items-center gap-1 ">
                    Descripción <span className="text-gold">*</span>
                  </label>
                  <textarea
                    placeholder="Descripción"
                    required
                    className="w-full px-4 py-2 border border-gray-2 rounded-lg resize-none focus:border-gold focus:outline-none"
                    rows={2}
                  />
                  <label className="font-bold text-blue-2 mb-1 flex items-center gap-1">
                    Familia <span className="text-gold">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-2 rounded-lg focus:border-gold focus:outline-none"
                    required
                  >
                    <option value="AENOR">AENOR</option>
                    <option value="CORE">CORE</option>
                  </select>
                  <div className="flex flex-col gap-2">
                    <label className="font-bold text-blue-2 mb-1 flex items-center gap-1">
                      Imagen <span className="text-gold">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-2 rounded-lg w-full h-[37vh] flex flex-col items-center justify-center gap-2 p-4">
                      {imagePreview ? (
                        <>
                          <img
                            src={imagePreview}
                            alt="Vista previa"
                            className="max-h-32 max-w-[220px] rounded-lg shadow mb-2 object-contain"
                          />
                          <button
                            type="button"
                            className="text-red-500 text-xs font-semibold mb-2 underline hover:text-red-700"
                            onClick={() => {
                              setImagePreview(null);
                              if (imageInputRef.current) {
                                imageInputRef.current.value = "";
                              }
                            }}
                          >
                            Eliminar imagen
                          </button>
                          <label
                            htmlFor="product-image-upload"
                            className="bg-blue-2 text-white px-4 py-2 rounded-lg font-bold text-base hover:bg-gold cursor-pointer transition-colors block text-center w-fit"
                          >
                            Subir imagen
                          </label>
                        </>
                      ) : (
                        <>
                          <TiUpload size={36} className="text-gray-3" />
                          <span className="text-gray-3 text-xs font-semibold">
                            Solo archivos JPG o PNG
                          </span>
                          <label
                            htmlFor="product-image-upload"
                            className="bg-blue-2 text-white px-4 py-2 rounded-lg font-bold text-base hover:bg-gold cursor-pointer transition-colors block text-center w-fit"
                          >
                            Subir imagen
                          </label>
                        </>
                      )}
                      <input
                        id="product-image-upload"
                        type="file"
                        accept="image/jpeg,image/png"
                        className="hidden"
                        ref={imageInputRef}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) =>
                              setImagePreview(ev.target.result);
                            reader.readAsDataURL(file);
                          } else {
                            setImagePreview(null);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 mt-6">
                  <label className="font-bold text-blue-2 mb-1">Precios</label>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Product size and price inputs, responsive layout */}
                    <div className="rounded-lg p-4 flex flex-col gap-3 bg-gray-2/40">
                      <h3 className="font-semibold text-blue-2 mb-2 text-left text-base flex items-center gap-1">
                        Normal <span className="text-gold">*</span>
                      </h3>
                      <input
                        type="number"
                        min={0}
                        placeholder="36000"
                        required
                        className="w-full px-3 py-2 border border-gray-2 rounded-md bg-white focus:border-gold focus:outline-none text-sm md:text-base"
                      />
                      <input
                        type="text"
                        placeholder="24cm x 11,5cm x 11,5cm"
                        defaultValue="24cm x 11,5cm x 11,5cm"
                        required
                        className="w-full px-3 py-2 border border-gray-2 rounded-md bg-white focus:border-gold focus:outline-none text-sm md:text-base"
                      />
                    </div>
                    <div className="rounded-lg p-4 flex flex-col gap-3 bg-gray-2/40">
                      <h3 className="font-semibold text-blue-2 mb-2 text-left text-base flex items-center gap-1">
                        Small <span className="text-gold">*</span>
                      </h3>
                      <input
                        type="number"
                        min={0}
                        placeholder="30000"
                        required
                        className="w-full px-3 py-2 border border-gray-2 rounded-md bg-white focus:border-gold focus:outline-none text-sm md:text-base"
                      />
                      <input
                        type="text"
                        placeholder="17cm x 9,5cm x 9,5cm"
                        defaultValue="17cm x 9,5cm x 9,5cm"
                        required
                        className="w-full px-3 py-2 border border-gray-2 rounded-md bg-white focus:border-gold focus:outline-none text-sm md:text-base"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg bg-gray-2 text-blue-2 font-bold hover:bg-blue-2 hover:text-white cursor-pointer transition-colors"
                    onClick={() => {
                      // Reset form fields
                      const form = document.getElementById("add-product-form");
                      if (form) form.reset();
                      setImagePreview(null);
                      if (imageInputRef && imageInputRef.current)
                        imageInputRef.current.value = "";
                      setShowModal(false);
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-2 text-white font-bold hover:bg-gold cursor-pointer transition-colors"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
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
                      <button className="bg-blue-2 text-white px-3 py-1 rounded-lg text-xs font-bold mr-2 hover:bg-gold transition-colors">
                        Editar
                      </button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-700 transition-colors">
                        Eliminar
                      </button>
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
