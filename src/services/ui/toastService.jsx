import { toast } from "react-toastify";
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoInformationCircle,
} from "react-icons/io5";
import { toastConfig } from "../../components/common/CustomToast";

/**
 * Component to render toast content (icon + message only)
 * Keeps the content lightweight and separated from toast container styling
 */
const ToastContent = ({ icon: Icon, message, iconColor }) => (
  <div className="flex items-center gap-3">
    <Icon className={`${iconColor} text-2xl shrink-0`} />
    <span className="font-family-sora font-semibold text-sm">{message}</span>
  </div>
);

/**
 * Centralized service to display custom-styled toasts with configurable icons and colors
 */

export const showCustomToast = {
  success: (message, options = {}) => {
    const config = toastConfig.success;
    toast.success(
      <ToastContent
        icon={IoCheckmarkCircle}
        message={message}
        iconColor={config.iconColor}
      />,
      {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        icon: false,
        className: `${config.bgContainer} ${config.borderColor} ${config.shadowColor} rounded-lg ${config.progressBarClass}`,
        bodyClassName: "p-0",
        ...options,
      }
    );
  },

  error: (message, options = {}) => {
    const config = toastConfig.error;
    toast.error(
      <ToastContent
        icon={IoCloseCircle}
        message={message}
        iconColor={config.iconColor}
      />,
      {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        icon: false,
        className: `${config.bgContainer} ${config.borderColor} ${config.shadowColor} rounded-lg ${config.progressBarClass}`,
        bodyClassName: "p-0",
        ...options,
      }
    );
  },

  info: (message, options = {}) => {
    const config = toastConfig.info;
    toast.info(
      <ToastContent
        icon={IoInformationCircle}
        message={message}
        iconColor={config.iconColor}
      />,
      {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        icon: false,
        className: `${config.bgContainer} ${config.borderColor} ${config.shadowColor} rounded-lg ${config.progressBarClass}`,
        bodyClassName: "p-0",
        ...options,
      }
    );
  },
};
