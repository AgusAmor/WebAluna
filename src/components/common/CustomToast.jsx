import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoInformationCircle,
} from "react-icons/io5";

export const toastConfig = {
  success: {
    icon: IoCheckmarkCircle,
    iconColor: "text-gold",
    textColor: "text-gray-2",
    borderColor: "border-l-4 border-gold",
    progressBarClass: "toast-progress-gold",
  },
  error: {
    icon: IoCloseCircle,
    iconColor: "text-red-500",
    textColor: "text-gray-2",
    borderColor: "border-l-4 border-red-500",
    progressBarClass: "toast-progress-red",
  },
  info: {
    icon: IoInformationCircle,
    iconColor: "text-blue-2",
    textColor: "text-gray-2",
    borderColor: "border-l-4 border-blue-2",
    progressBarClass: "toast-progress-blue",
  },
};

const CustomToast = ({ type = "info", message }) => {
  const config = toastConfig[type] || toastConfig.info;
  const Icon = config.icon;

  return (
    <div
      className={`
        flex items-center gap-3 p-4 rounded-lg
        ${config.bgContainer}
        ${config.borderColor}
        ${config.shadowColor}
      `}
      role="alert"
    >
      {/* Icon */}
      <Icon className={`${config.iconColor} text-2xl shrink-0`} />

      {/* Message */}
      <div className="flex-1">
        <p
          className={`font-family-sora font-semibold text-sm ${config.textColor}`}
        >
          {message}
        </p>
      </div>
    </div>
  );
};

export default CustomToast;
