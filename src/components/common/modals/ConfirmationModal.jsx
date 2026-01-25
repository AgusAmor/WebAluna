import React from "react";
import PropTypes from "prop-types";
import { IoIosClose } from "react-icons/io";
import { ImSpinner2 } from "react-icons/im";
import { FaCheckCircle } from "react-icons/fa";

/**
 * Reusable confirmation modal component
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {string} props.title - Modal title
 * @param {string} props.message - Modal message/content
 * @param {string} [props.description] - Additional description text
 * @param {function} props.onConfirm - Callback when user confirms
 * @param {function} props.onCancel - Callback when user cancels
 * @param {boolean} [props.isLoading=false] - Whether action is loading
 * @param {string} [props.confirmText="Confirmar"] - Text for confirm button
 * @param {string} [props.cancelText="Cancelar"] - Text for cancel button
 * @param {string} [props.variant="default"] - Button variant: "default", "danger", "warning"
 */
const ConfirmationModal = ({
  isOpen,
  title,
  message,
  description,
  onConfirm,
  onCancel,
  isLoading = false,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "default",
}) => {
  if (!isOpen) return null;

  const getButtonColors = () => {
    switch (variant) {
      case "danger":
        return "bg-red-500 hover:bg-red-600";
      case "warning":
        return "bg-yellow-500 hover:bg-yellow-600";
      default:
        return "bg-blue-2 hover:bg-blue-1";
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-family-sora">
      {/* Backdrop */}
      <div
        className="fixed inset-0 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(38,78,96,0.45)" }}
        onClick={onCancel}
      ></div>

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="relative bg-white rounded-lg shadow-xl max-w-md w-full animate-fadeInScale"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="absolute top-3 right-3 cursor-pointer text-blue-2 hover:text-gold hover:scale-150 transition-all z-10 disabled:opacity-50"
            title="Cerrar"
          >
            <IoIosClose size={26} />
          </button>

          {/* Header */}
          <div className="p-6 border-b border-gray-2">
            <h2 className="text-xl font-bold font-family-comfortaa text-blue-2 pr-8">
              {title}
            </h2>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center text-blue-1 font-semibold text-md mb-3">
              {message}
            </div>
            {description && (
              <div className="text-gray-1 text-xs font-medium mb-6 text-center">
                {description}
              </div>
            )}
          </div>

          {/* Footer - Buttons */}
          <div className="flex gap-3 p-6 border-t border-gray-2 bg-gray-3/30">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 py-2 px-4 border border-gray-2 rounded-lg text-gray-1 hover:bg-gray-3 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 py-2 px-4 rounded-lg text-white transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${getButtonColors()}`}
            >
              {isLoading ? (
                <>
                  <ImSpinner2 className="animate-spin h-4 w-4" />
                  <span>Procesando...</span>
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  description: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  variant: PropTypes.oneOf(["default", "danger", "warning"]),
};

/**
 * Single button confirmation modal with large decorative icon
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {string} props.title - Modal title
 * @param {string} props.message - Modal message/content
 * @param {string} [props.description] - Additional description text
 * @param {function} props.onConfirm - Callback when user confirms
 * @param {boolean} [props.isLoading=false] - Whether action is loading
 * @param {string} [props.confirmText="Confirmar"] - Text for confirm button
 * @param {React.ReactNode} [props.icon] - Icon to display (defaults to FaCheckCircle)
 * @param {string} [props.variant="default"] - Button variant: "default", "danger", "warning"
 */
export const SingleButtonConfirmationModal = ({
  isOpen,
  title,
  message,
  description,
  onConfirm,
  isLoading = false,
  confirmText = "Confirmar",
  icon,
  variant = "default",
}) => {
  if (!isOpen) return null;

  const getButtonColors = () => {
    switch (variant) {
      case "danger":
        return "bg-red-500 hover:bg-red-600";
      case "warning":
        return "bg-yellow-500 hover:bg-yellow-600";
      default:
        return "bg-blue-2 hover:bg-blue-1";
    }
  };

  const DisplayIcon = icon || FaCheckCircle;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-family-sora">
      {/* Backdrop */}
      <div
        className="fixed inset-0 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(38,78,96,0.45)" }}
      ></div>

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="relative bg-white rounded-lg shadow-xl max-w-md w-full animate-fadeInScale"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Large Icon */}
          <div className="flex justify-center pt-12 pb-2">
            <div className="text-blue-2 text-8xl opacity-90">
              {typeof DisplayIcon === "function" ? (
                <DisplayIcon />
              ) : (
                DisplayIcon
              )}
            </div>
          </div>

          {/* Header */}
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold font-family-comfortaa text-blue-2">
              {title}
            </h2>
          </div>

          {/* Content */}
          <div className="px-6 pb-8">
            <div className="text-center text-blue-1 font-semibold text-base mb-3">
              {message}
            </div>
            {description && (
              <div className="text-gray-1 text-sm font-medium text-center">
                {description}
              </div>
            )}
          </div>

          {/* Footer - Single Button */}
          <div className="flex p-6 border-t border-gray-2 bg-gray-3/30 justify-center">
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`py-2 px-8 rounded-lg text-white transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${getButtonColors()}`}
            >
              {isLoading ? (
                <>
                  <ImSpinner2 className="animate-spin h-4 w-4" />
                  <span>Procesando...</span>
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

SingleButtonConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  description: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  confirmText: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  variant: PropTypes.oneOf(["default", "danger", "warning"]),
};

export default ConfirmationModal;
