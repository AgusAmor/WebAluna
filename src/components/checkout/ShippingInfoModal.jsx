import React from "react";
import PropTypes from "prop-types";
import { IoIosClose } from "react-icons/io";
import { FaTruck, FaMapPin, FaCheck } from "react-icons/fa";

/**
 * Modal informativo para opciones de envío a domicilio
 * Muestra información sobre envío gratis y cobertura geográfica en layout de dos columnas
 */
const ShippingInfoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto font-family-sora"
      style={{ pointerEvents: "auto" }}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(38,78,96,0.45)" }}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl animate-fadeInScale">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-blue-2 hover:text-gold transition-colors z-10"
            title="Cerrar"
          >
            <IoIosClose className="h-8 w-8" />
          </button>

          {/* Content */}
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <FaTruck className="text-blue-2 text-3xl" />
              <h2 className="text-2xl font-bold text-blue-2">
                Envío a Domicilio
              </h2>
            </div>

            {/* Two Cards Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Card 1: Free Shipping */}
              <div className="bg-white shadow-md border-2 border-blue-2 rounded-lg p-6">
                <h3 className="font-bold text-blue-2 text-lg mb-3 flex items-center gap-2">
                  <FaCheck className="text-gold text-lg" />
                  Envío Gratis
                </h3>
                <p className="text-blue-3 text-sm mb-2">
                  Recibe envío gratis en todas las compras mayores a{" "}
                  <span className="font-bold">$80.000</span>
                </p>
                <p className="text-gray-1 text-xs">
                  En compras menores, el envío se calcula según la distancia
                  desde nuestro local
                </p>
              </div>

              {/* Card 2: Coverage */}
              <div className="bg-white shadow-md border-2 border-blue-2 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <FaMapPin className="text-gold text-xl mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-bold text-blue-2 text-lg mb-3">
                      Cobertura de Envío
                    </h3>
                    <p className="text-blue-3 text-sm mb-2">
                      Realizamos envíos solamente a{" "}
                      <span className="font-bold">CABA</span>
                    </p>
                    <p className="text-gray-1 text-xs">
                      Si tu dirección está fuera de CABA, por favor selecciona
                      "Retiro en local"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-3 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-2">
                <span className="font-semibold text-blue-2">Nota:</span> El
                envío será calculado automáticamente una vez que ingreses tu
                dirección de entrega
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full bg-gold hover:bg-gold/80 text-white font-bold py-3 px-4 rounded-lg transition-colors font-family-sora"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ShippingInfoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ShippingInfoModal;
