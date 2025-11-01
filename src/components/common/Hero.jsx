import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const Hero = ({ title, subtitle }) => {
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div
      className={`
        flex flex-col justify-center items-center text-center
        py-12 px-8 rounded-lg shadow-lg mx-auto my-8 max-w-full
        ${
          isAdminPage
            ? "bg-linear-to-br from-dorado to-gris-3"
            : "bg-linear-to-br from-azul-2 to-azul-3"
        }
      `}
    >
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-black font-family-comfortaa mb-2 text-blanco drop-shadow-md">
        {title}
      </h1>
      <p className="text-lg md:text-xl font-normal font-family-sora text-gris-3 drop-shadow-sm">
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
