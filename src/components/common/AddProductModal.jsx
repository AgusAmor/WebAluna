import { useState } from "react";
import PropTypes from "prop-types";
import { FiX, FiUpload, FiDollarSign } from "react-icons/fi";

const AddProductModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    family: "AENOR",
    description: "",
    image: null,
    imagePreview: null,
    pricing: {
      normal: {
        price: "",
        size: "",
        description: "Tamaño estándar",
      },
      small: {
        price: "",
        size: "",
        description: "Tamaño compacto",
      },
    },
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      // Handle nested objects (pricing)
      const [parent, child, grandchild] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: {
            ...prev[parent][child],
            [grandchild]: value,
          },
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("📁 Archivo seleccionado:", {
        name: file.name,
        type: file.type,
        size: file.size,
        sizeInMB: (file.size / (1024 * 1024)).toFixed(2),
      });

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          image: "Solo se permiten archivos JPG, PNG y WEBP",
        }));
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "La imagen debe ser menor a 5MB",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));

      // Clear image error
      setErrors((prev) => ({
        ...prev,
        image: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre del producto es obligatorio";
    }

    if (!formData.description.trim()) {
      newErrors.description = "La descripción es obligatoria";
    }

    if (!formData.image) {
      newErrors.image = "La imagen del producto es obligatoria";
    }

    // Validate pricing
    if (!formData.pricing.normal.price || formData.pricing.normal.price <= 0) {
      newErrors.normalPrice =
        "El precio normal es obligatorio y debe ser mayor a 0";
    }

    if (!formData.pricing.normal.size.trim()) {
      newErrors.normalSize = "El tamaño normal es obligatorio";
    }

    if (!formData.pricing.small.price || formData.pricing.small.price <= 0) {
      newErrors.smallPrice =
        "El precio pequeño es obligatorio y debe ser mayor a 0";
    }

    if (!formData.pricing.small.size.trim()) {
      newErrors.smallSize = "El tamaño pequeño es obligatorio";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      console.log("🚀 Enviando formulario de producto:", {
        name: formData.name,
        family: formData.family,
        hasImage: !!formData.image,
        imageType: formData.image?.type,
        imageSize: formData.image?.size,
      });

      const result = await onSave(formData);

      console.log("✅ Producto guardado exitosamente:", result);

      handleReset();
      onClose();
    } catch (error) {
      console.error("❌ Error saving product:", error);

      let errorMessage = "Error al guardar el producto. Inténtalo de nuevo.";

      // Mensajes de error más específicos
      if (error.message.includes("imagen")) {
        errorMessage =
          "Error al subir la imagen. Verifica que sea un archivo válido.";
      } else if (error.message.includes("Firebase")) {
        errorMessage = "Error de conexión. Verifica tu conexión a internet.";
      } else if (error.message.includes("permission")) {
        errorMessage = "No tienes permisos para realizar esta acción.";
      }

      setErrors({
        submit: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      family: "AENOR",
      description: "",
      image: null,
      imagePreview: null,
      pricing: {
        normal: {
          price: "",
          size: "",
          description: "Tamaño estándar",
        },
        small: {
          price: "",
          size: "",
          description: "Tamaño compacto",
        },
      },
    });
    setErrors({});
    setLoading(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-family-sora">
      {/* Backdrop - mismo estilo que otros modales */}
      <div
        className="fixed inset-0 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(38,78,96,0.45)" }}
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 border-b border-gray-2 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold font-family-comfortaa text-blue-1">
                Agregar Nuevo Producto
              </h2>
              <p className="text-gray-1 mt-1 text-sm">
                Completa la información del producto
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-1 hover:text-blue-1 transition-colors"
              disabled={loading}
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto max-h-[75vh]">
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-6">
              {/* Submit Error */}
              {errors.submit && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {errors.submit}
                </div>
              )}

              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold font-family-comfortaa text-blue-1">
                  Información Básica
                </h3>

                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-blue-1 font-family-comfortaa">
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-2 ${
                      errors.name ? "border-red-500" : "border-gray-2"
                    }`}
                    placeholder="Ej: Lámpara Luna 3D"
                    disabled={loading}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Family */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-blue-1 font-family-comfortaa">
                    Familia del Producto *
                  </label>
                  <select
                    name="family"
                    value={formData.family}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-2"
                    disabled={loading}
                  >
                    <option value="AENOR">AENOR</option>
                    <option value="CORE">CORE</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-blue-1 font-family-comfortaa">
                    Descripción *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-2 resize-none ${
                      errors.description ? "border-red-500" : "border-gray-2"
                    }`}
                    placeholder="Describe las características del producto..."
                    disabled={loading}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold font-family-comfortaa text-blue-1">
                  Imagen del Producto
                </h3>

                <div>
                  <label className="block text-sm font-medium mb-1 text-blue-1 font-family-comfortaa">
                    Imagen Principal *
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center ${
                      errors.image ? "border-red-500" : "border-gray-2"
                    }`}
                  >
                    {formData.imagePreview ? (
                      <div className="space-y-4">
                        <img
                          src={formData.imagePreview}
                          alt="Preview"
                          className="mx-auto max-h-48 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              image: null,
                              imagePreview: null,
                            }))
                          }
                          className="text-red-500 hover:text-red-700 text-sm"
                          disabled={loading}
                        >
                          Cambiar imagen
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <FiUpload className="mx-auto text-gray-1" size={48} />
                        <div>
                          <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            disabled={loading}
                          />
                          <label
                            htmlFor="image"
                            className="cursor-pointer bg-blue-2 text-white px-4 py-2 rounded-lg hover:bg-blue-1 transition-colors inline-block"
                          >
                            Seleccionar Imagen
                          </label>
                        </div>
                        <p className="text-sm text-gray-1">
                          PNG, JPG, WEBP hasta 5MB
                        </p>
                      </div>
                    )}
                  </div>
                  {errors.image && (
                    <p className="text-red-500 text-xs mt-1">{errors.image}</p>
                  )}
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold font-family-comfortaa text-blue-1">
                  Precios y Tamaños
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Normal Size */}
                  <div className="space-y-4 p-4 border border-gray-2 rounded-lg">
                    <h4 className="font-medium text-blue-1">Tamaño Normal</h4>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-blue-1 font-family-comfortaa">
                        Precio *
                      </label>
                      <div className="relative">
                        <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-1" />
                        <input
                          type="number"
                          name="pricing.normal.price"
                          value={formData.pricing.normal.price}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-2 ${
                            errors.normalPrice
                              ? "border-red-500"
                              : "border-gray-2"
                          }`}
                          placeholder="25000"
                          min="0"
                          disabled={loading}
                        />
                      </div>
                      {errors.normalPrice && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.normalPrice}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-blue-1 font-family-comfortaa">
                        Tamaño *
                      </label>
                      <input
                        type="text"
                        name="pricing.normal.size"
                        value={formData.pricing.normal.size}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-2 ${
                          errors.normalSize ? "border-red-500" : "border-gray-2"
                        }`}
                        placeholder="15cm"
                        disabled={loading}
                      />
                      {errors.normalSize && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.normalSize}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Small Size */}
                  <div className="space-y-4 p-4 border border-gray-2 rounded-lg">
                    <h4 className="font-medium text-blue-1">Tamaño Pequeño</h4>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-blue-1 font-family-comfortaa">
                        Precio *
                      </label>
                      <div className="relative">
                        <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-1" />
                        <input
                          type="number"
                          name="pricing.small.price"
                          value={formData.pricing.small.price}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-2 ${
                            errors.smallPrice
                              ? "border-red-500"
                              : "border-gray-2"
                          }`}
                          placeholder="18000"
                          min="0"
                          disabled={loading}
                        />
                      </div>
                      {errors.smallPrice && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.smallPrice}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-blue-1 font-family-comfortaa">
                        Tamaño *
                      </label>
                      <input
                        type="text"
                        name="pricing.small.size"
                        value={formData.pricing.small.size}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-2 ${
                          errors.smallSize ? "border-red-500" : "border-gray-2"
                        }`}
                        placeholder="10cm"
                        disabled={loading}
                      />
                      {errors.smallSize && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.smallSize}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-2 px-5 pb-5">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 text-blue-1 border border-gray-2 rounded-lg hover:bg-gray-3 transition-colors font-family-sora"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-2 text-white rounded-lg hover:bg-gold hover:text-blue-1 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold font-family-sora"
                  disabled={loading}
                >
                  {loading ? "Guardando..." : "Guardar Producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

AddProductModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default AddProductModal;
