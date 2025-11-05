import { Link, useLocation } from "react-router-dom";
import { FaTiktok } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { ImWhatsapp } from "react-icons/im";
import { IoIosMail } from "react-icons/io";
import isotipo from "../../assets/logos/isotipo.png";
import isotipogold from "../../assets/logos/isotipo-dorado.png";

const Footer = () => {
  const location = useLocation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-blue-1 text-white mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 mb-4 group cursor-pointer"
              aria-label="Scroll to top"
            >
              <div className="relative h-8 w-8">
                <img
                  src={isotipo}
                  alt="Aluna Logo"
                  className="absolute inset-0 h-8 w-8 transition-opacity duration-300 group-hover:opacity-0"
                />
                <img
                  src={isotipogold}
                  alt="Aluna Logo gold"
                  className="absolute inset-0 h-8 w-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              </div>
              <h3 className="text-lg md:text-xl font-bold font-family-comfortaa pt-1 group-hover:text-gold transition-colors duration-300">
                Aluna
              </h3>
            </button>
            <p className="text-gray-3 text-sm md:text-base font-family-sora leading-relaxed">
              Lámparas únicas con impresión 3D. Combinamos tecnología y
              creatividad artesanal para transformar cualquier ambiente.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:pl-10">
            <h4 className="text-sm md:text-base font-semibold mb-4 font-family-comfortaa">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-2 font-family-sora">
              <li>
                <Link
                  to="/"
                  className={`text-gray-3 hover:text-gold text-sm md:text-base transition-colors ${
                    location.pathname === "/" ? "text-gold font-semibold" : ""
                  }`}
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/productos"
                  className={`text-gray-3 hover:text-gold text-sm md:text-base transition-colors ${
                    location.pathname === "/productos"
                      ? "text-gold font-semibold"
                      : ""
                  }`}
                >
                  Productos
                </Link>
              </li>
              <li>
                <Link
                  to="/sobre-nosotros"
                  className={`text-gray-3 hover:text-gold text-sm md:text-base transition-colors ${
                    location.pathname === "/sobre-nosotros"
                      ? "text-gold font-semibold"
                      : ""
                  }`}
                >
                  Nosotros
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-sm md:text-base font-semibold mb-4 font-family-comfortaa">
              Contacto
            </h4>
            <ul className="space-y-3 text-sm md:text-base text-gray-3 font-family-sora">
              <li>
                <a
                  href="mailto:aluna.3d.design@gmail.com"
                  className="hover:text-gold transition-colors flex items-start gap-2"
                  aria-label="Enviar correo a Aluna"
                >
                  <IoIosMail className="text-xl md:text-2xl shrink-0 mt-0.5" />
                  <span className="break-all">aluna.3d.design@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/5491173584811"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors flex items-center gap-2"
                  aria-label="Contactar por WhatsApp"
                >
                  <ImWhatsapp className="text-xl md:text-2xl shrink-0" />
                  <span>+54 11 7358-4811</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-sm md:text-base font-semibold mb-4 font-family-comfortaa">
              Seguinos
            </h4>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/aluna_3d/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-3 hover:text-gold transition-colors text-2xl md:text-3xl"
                aria-label="Visitar Instagram de Aluna"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-3 hover:text-gold transition-colors text-2xl md:text-3xl"
                aria-label="Visitar TikTok de Aluna"
              >
                <FaTiktok />
              </a>
            </div>
          </div>
        </div>

        <hr className="border-blue-2 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-3 text-sm font-family-sora">
            © {new Date().getFullYear()} Aluna. Todos los derechos reservados.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0 font-family-sora">
            <Link
              to="/privacidad"
              className="text-gray-3 hover:text-gold text-sm transition-colors"
            >
              Política de Privacidad
            </Link>
            <Link
              to="/terminos"
              className="text-gray-3 hover:text-gold text-sm transition-colors"
            >
              Términos y Condiciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
