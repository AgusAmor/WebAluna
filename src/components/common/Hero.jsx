import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { isAdminRoute } from "../../utils/adminUtils";

const Hero = ({ title, subtitle }) => {
  const location = useLocation();

  const isAdminPage = isAdminRoute(location.pathname);

  return (
    <div
      className={`
        flex flex-col justify-center items-center text-center
        py-6 md:py-12 px-4 md:px-8 rounded-lg shadow-lg mx-auto my-4 md:my-8 max-w-full
        ${
          isAdminPage
            ? "bg-linear-to-br from-gold to-gray-2"
            : "bg-linear-to-br from-blue-2 to-blue-3"
        }
      `}
    >
      <h1 className="text-2xl md:text-4xl lg:text-5xl font-black font-family-comfortaa mb-2 text-white drop-shadow-md">
        {title}
      </h1>
      <p className="text-sm md:text-lg lg:text-xl font-normal font-family-sora text-gray-3 drop-shadow-sm">
        {subtitle}
      </p>
    </div>
  );
};

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
};

export default Hero;
