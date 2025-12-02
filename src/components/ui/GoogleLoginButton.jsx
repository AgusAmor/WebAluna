import { FcGoogle } from "react-icons/fc";
import { ImSpinner2 } from "react-icons/im";
import PropTypes from "prop-types";

/**
 * Google Login Button Component
 */
const GoogleLoginButton = ({ onClick, disabled = false, loading = false }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? (
        <>
          <ImSpinner2 className="w-5 h-5 mr-2 animate-spin" />
          Conectando...
        </>
      ) : (
        <>
          <FcGoogle className="w-5 h-5 mr-2" />
          Continuar con Google
        </>
      )}
    </button>
  );
};

GoogleLoginButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
};

export default GoogleLoginButton;
