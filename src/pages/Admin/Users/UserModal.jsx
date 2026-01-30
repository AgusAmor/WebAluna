import React from "react";
import { IoIosClose } from "react-icons/io";
import { useModalScroll } from "../../../hooks/ui";

/**
 * UserModal Component
 * Modal dialog for creating or editing users
 *
 * @param {boolean} isOpen - Whether modal is open
 * @param {Object} user - User being edited (null if creating new)
 * @param {boolean} saving - Saving state
 * @param {string} error - Error message if any
 * @param {Function} onClose - Callback when modal is closed
 * @param {Function} onSubmit - Callback when form is submitted
 * @param {React.ReactNode} children - UserForm component
 */
const UserModal = ({
  isOpen,
  user,
  saving,
  error,
  onClose,
  onSubmit,
  children,
}) => {
  useModalScroll(isOpen);
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-xl shadow-lg p-6 md:p-8 w-full max-w-3xl min-w-[350px] relative max-h-[90vh] overflow-y-auto flex flex-col animate-fadeInScale"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 cursor-pointer text-blue-2 hover:text-gold hover:scale-150 transition-all z-10"
          onClick={onClose}
          aria-label="Close"
        >
          <IoIosClose size={26} />
        </button>
        <h2 className="text-xl md:text-2xl font-bold text-blue-2 mb-4 font-family-comfortaa shrink-0 pr-8">
          {user ? "Editar usuario" : "Agregar usuario"}
        </h2>
        {children}
      </div>
    </div>
  );
};

export default UserModal;
