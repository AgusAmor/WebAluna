import React from "react";
import PropTypes from "prop-types";
import { IoIosClose } from "react-icons/io";
import { FaTruck, FaMapPin, FaCheck } from "react-icons/fa";
import { useModalScroll } from "../../hooks/ui";

/**
 * Modal informativo para opciones de envío a domicilio
 * Muestra información sobre envío gratis y cobertura geográfica en layout de dos columnas
 */
const ShippingInfoModal = ({ isOpen, onClose }) => {
  useModalScroll(isOpen);
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden font-family-sora"
      style={{ pointerEvents: "auto" }}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(38,78,96,0.45)" }}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="flex min-h-screen items-center justify-center p-2 sm:p-4">
        <div className="relative w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-3xl bg-white rounded-xl shadow-2xl animate-fadeInScale">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-2 sm:right-3 top-2 sm:top-3 cursor-pointer text-blue-2 hover:text-gold hover:scale-150 transition-all z-10 p-1"
            title="Cerrar"
          >
            <IoIosClose size={24} className="sm:w-7 sm:h-7" />
          </button>

          {/* Content */}
          <div className="p-4 sm:p-6 md:p-8">
            {/* Header */}
            <div className="flex items-center gap-2 sm:gap-3 mb-6 md:mb-8">
              <FaTruck className="text-blue-2 text-2xl md:text-3xl" />
              <h2 className="text-xl md:text-2xl font-bold text-blue-2">
                Envío a Domicilio
              </h2>
            </div>

            {/* Two Cards Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 mb-4 md:mb-6">
              {/* Card 1: Free Shipping */}
              <div className="bg-white shadow-md border-2 border-blue-2 rounded-lg p-4 md:p-6">
                <h3 className="font-bold text-blue-2 text-base md:text-lg mb-2 md:mb-3 flex items-center gap-2">
                  <FaCheck className="text-gold text-sm md:text-lg" />
                  Envío Gratis
                </h3>
                <p className="text-blue-3 text-xs md:text-sm mb-2">
                  Recibe envío gratis en todas las compras mayores a{" "}
                  <span className="font-bold">$80.000</span>
                </p>
                <p className="text-gray-1 text-xs">
                  En compras menores, el envío se calcula según la distancia
                  desde nuestro local
                </p>
              </div>

              {/* Card 2: Coverage */}
              <div className="bg-white shadow-md border-2 border-blue-2 rounded-lg p-4 md:p-6">
                <div className="flex items-start gap-2 md:gap-3">
                  <FaMapPin className="text-gold text-lg md:text-xl mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-bold text-blue-2 text-base md:text-lg mb-2 md:mb-3">
                      Cobertura de Envío
                    </h3>
                    <p className="text-blue-3 text-xs md:text-sm mb-2">
                      Realizamos envíos solamente a{" "}
                      <span className="font-bold">CABA y GBA</span>
                    </p>
                    <p className="text-gray-1 text-xs">
                      Si tu dirección está fuera de CABA y GBA, por favor
                      selecciona "Retiro en local"
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
