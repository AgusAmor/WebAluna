import React, { useRef } from "react";

/**
 * ProductForm component for creating and editing products.
 */
const ProductForm = ({
  initialProduct = null,
  imagePreview,
  setImagePreview,
  saving,
  error,
  onCancel,
  onSubmit,
  buttonLabel = "Guardar",
}) => {
  const imageInputRef = useRef(null);

  return (
    <form
      className="space-y-4 flex-1"
      id="add-product-form"
      onSubmit={onSubmit}
    >
      <div
        className="flex flex-col gap-4 overflow-y-auto"
        style={{ maxHeight: "60vh" }}
      >
        {/* Product name input */}
        <label className="font-bold text-blue-2 mb-1 flex items-center gap-1">
          Nombre <span className="text-gold">*</span>
        </label>
        <input
          name="name"
          type="text"
          placeholder="Nombre"
          required
          defaultValue={initialProduct ? initialProduct.name : ""}
          className="w-full px-4 py-2 border border-gray-2 rounded-lg focus:border-gold focus:outline-none"
        />
        {/* Product description input */}
        <label className="font-bold  text-blue-2 mb-1 flex items-center gap-1 ">
          Descripción <span className="text-gold">*</span>
        </label>
        <textarea
          name="description"
          placeholder="Descripción"
          required
          defaultValue={initialProduct ? initialProduct.description : ""}
          className="w-full px-4 py-2 border border-gray-2 rounded-lg resize-none focus:border-gold focus:outline-none"
          rows={2}
        />
        {/* Product family selection */}
        <label className="font-bold text-blue-2 mb-1 flex items-center gap-1">
          Familia <span className="text-gold">*</span>
        </label>
        <select
          name="family"
          className="w-full px-4 py-2 border border-gray-2 rounded-lg focus:border-gold focus:outline-none"
          required
          defaultValue={initialProduct ? initialProduct.family : "AENOR"}
        >
          <option value="AENOR">AENOR</option>
          <option value="CORE">CORE</option>
        </select>
        {/* Image upload section: shows preview, allows upload and removal */}
        <div className="flex flex-col gap-2">
          <label className="font-bold text-blue-2 mb-1 flex items-center gap-1">
            Imagen <span className="text-gold">*</span>
          </label>
          {/* Image preview and upload controls */}
          <div className="border-2 border-dashed border-gray-2 rounded-lg w-full h-[37vh] flex flex-col items-center justify-center gap-2 p-4">
            {imagePreview ? (
              <>
                {/* Image preview and remove button */}
                <img
                  src={imagePreview}
                  alt="Preview"
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
                {/* Upload new image button */}
                <label
                  htmlFor="product-image-upload"
                  className="bg-blue-2 text-white px-4 py-2 rounded-lg font-bold text-base hover:bg-gold cursor-pointer transition-colors block text-center w-fit"
                >
                  Subir imagen
                </label>
              </>
            ) : (
              <>
                {/* File type info and upload button */}
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
            {/* Hidden file input for image upload */}
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
                  reader.onload = (ev) => setImagePreview(ev.target.result);
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
        </div>
        {/* Price section: normal and small product prices and sizes */}
        <div className="flex flex-col gap-2 mt-6">
          <label className="font-bold text-blue-2 mb-1">Precios</label>
          <div className="grid grid-cols-2 gap-4">
            {/* Normal product price and size inputs */}
            <div className="rounded-lg p-4 flex flex-col gap-3 bg-gray-2/40">
              <h3 className="font-semibold text-blue-2 mb-2 text-left text-base flex items-center gap-1">
                Normal <span className="text-gold">*</span>
              </h3>
              <input
                name="normalPrice"
                type="number"
                min={0}
                placeholder="36000"
                required
                defaultValue={
                  initialProduct ? initialProduct.pricing?.normal?.price : ""
                }
                className="w-full px-3 py-2 border border-gray-2 rounded-md bg-white focus:border-gold focus:outline-none text-sm md:text-base"
              />
              <input
                name="normalSize"
                type="text"
                placeholder="24cm x 11,5cm x 11,5cm"
                required
                defaultValue={
                  initialProduct
                    ? initialProduct.pricing?.normal?.size
                    : "24cm x 11,5cm x 11,5cm"
                }
                className="w-full px-3 py-2 border border-gray-2 rounded-md bg-white focus:border-gold focus:outline-none text-sm md:text-base"
              />
            </div>
            {/* Small product price and size inputs */}
            <div className="rounded-lg p-4 flex flex-col gap-3 bg-gray-2/40">
              <h3 className="font-semibold text-blue-2 mb-2 text-left text-base flex items-center gap-1">
                Small <span className="text-gold">*</span>
              </h3>
              <input
                name="smallPrice"
                type="number"
                min={0}
                placeholder="30000"
                required
                defaultValue={
                  initialProduct ? initialProduct.pricing?.small?.price : ""
                }
                className="w-full px-3 py-2 border border-gray-2 rounded-md bg-white focus:border-gold focus:outline-none text-sm md:text-base"
              />
              <input
                name="smallSize"
                type="text"
                placeholder="17cm x 9,5cm x 9,5cm"
                required
                defaultValue={
                  initialProduct
                    ? initialProduct.pricing?.small?.size
                    : "17cm x 9,5cm x 9,5cm"
                }
                className="w-full px-3 py-2 border border-gray-2 rounded-md bg-white focus:border-gold focus:outline-none text-sm md:text-base"
              />
            </div>
          </div>
        </div>
        {/* Error message display */}
        {error && (
          <div className="text-red-500 font-bold text-center mt-2">{error}</div>
        )}
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          className="px-4 py-2 rounded-lg bg-gray-2 text-blue-2 font-bold hover:bg-blue-2 hover:text-white cursor-pointer transition-colors"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className={`px-4 py-2 rounded-lg font-bold transition-colors ${
            saving
              ? "bg-gray-2 text-gray-3 cursor-not-allowed"
              : "bg-blue-2 text-white hover:bg-gold cursor-pointer"
          }`}
          disabled={saving}
        >
          {saving ? "Guardando..." : buttonLabel}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
