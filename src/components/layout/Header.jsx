import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logos/logotipo.png";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY;

          // Histéresis más amplia: cambia a scrolled en 120px, vuelve a normal en 60px
          if (scrollPosition > 120) {
            setIsScrolled(true);
          } else if (scrollPosition < 60) {
            setIsScrolled(false);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tamaños del logo
  const logoSizeMobile = 64;
  const logoSizeDesktop = isScrolled ? 48 : 80;

  return (
    <>
      <header className="bg-azul-1 border-azul-2 dark:bg-azul-1 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          {/* Layout Mobile: Siempre igual (sin animación de scroll) */}
          <div className="flex lg:hidden items-center justify-between py-4">
            <Link to="/" className="shrink-0">
              <img
                src={logo}
                alt="LogoAluna"
                style={{ height: `${logoSizeMobile}px` }}
              />
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-blanco rounded-lg hover:bg-azul-2 focus:outline-none focus:ring-2 focus:ring-dorado"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Abrir menú</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>

          {/* Layout Desktop: Con animación basada en scroll */}
          {isScrolled ? (
            // Desktop scrolleado: Logo izquierda, Navbar derecha (en línea)
            <div className="hidden lg:flex items-center justify-between py-4 transition-all duration-500">
              <Link to="/" className="shrink-0">
                <img
                  src={logo}
                  alt="LogoAluna"
                  style={{ height: `${logoSizeDesktop}px` }}
                  className="transition-all duration-500 ease-out"
                />
              </Link>

              <nav className="flex flex-row space-x-8">
                <Link
                  to="/"
                  className={`font-family-comfortaa text-blanco hover:text-dorado hover:underline transition-colors duration-300 ${
                    location.pathname === "/" ? "text-dorado font-bold" : ""
                  }`}
                >
                  Inicio
                </Link>
                <Link
                  to="/productos"
                  className={`font-family-comfortaa text-blanco hover:text-dorado hover:underline transition-colors duration-300 ${
                    location.pathname === "/productos"
                      ? "text-dorado font-bold"
                      : ""
                  }`}
                >
                  Productos
                </Link>
                <Link
                  to="/sobre-nosotros"
                  className={`font-family-comfortaa text-blanco hover:text-dorado hover:underline transition-colors duration-300 ${
                    location.pathname === "/sobre-nosotros"
                      ? "text-dorado font-bold"
                      : ""
                  }`}
                >
                  Nosotros
                </Link>
                <Link
                  to="/contacto"
                  className={`font-family-comfortaa text-blanco hover:text-dorado hover:underline transition-colors duration-300 ${
                    location.pathname === "/contacto"
                      ? "text-dorado font-bold"
                      : ""
                  }`}
                >
                  Contacto
                </Link>
              </nav>
            </div>
          ) : (
            // Desktop sin scroll: Logo arriba centrado, Navbar abajo centrado
            <div className="hidden lg:flex flex-col items-center py-6 gap-4 transition-all duration-500">
              <Link to="/">
                <img
                  src={logo}
                  alt="LogoAluna"
                  style={{ height: `${logoSizeDesktop}px` }}
                  className="transition-all duration-500 ease-out"
                />
              </Link>

              <nav className="flex flex-row space-x-8">
                <Link
                  to="/"
                  className={`font-family-comfortaa text-blanco hover:text-dorado hover:underline transition-colors duration-300 ${
                    location.pathname === "/" ? "text-dorado font-bold" : ""
                  }`}
                >
                  Inicio
                </Link>
                <Link
                  to="/productos"
                  className={`font-family-comfortaa text-blanco hover:text-dorado hover:underline transition-colors duration-300 ${
                    location.pathname === "/productos"
                      ? "text-dorado font-bold"
                      : ""
                  }`}
                >
                  Productos
                </Link>
                <Link
                  to="/sobre-nosotros"
                  className={`font-family-comfortaa text-blanco hover:text-dorado hover:underline transition-colors duration-300 ${
                    location.pathname === "/sobre-nosotros"
                      ? "text-dorado font-bold"
                      : ""
                  }`}
                >
                  Nosotros
                </Link>
                <Link
                  to="/contacto"
                  className={`font-family-comfortaa text-blanco hover:text-dorado hover:underline transition-colors duration-300 ${
                    location.pathname === "/contacto"
                      ? "text-dorado font-bold"
                      : ""
                  }`}
                >
                  Contacto
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Menú Mobile desplegable fuera del header con animación */}
      <div
        className={`lg:hidden fixed top-[88px] left-0 right-0 bg-azul-1 shadow-lg z-40 overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col py-2 px-4 space-y-1">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className={`font-family-comfortaa block py-2 px-3 text-blanco rounded hover:bg-azul-2 hover:text-dorado hover:underline transition-colors duration-300 ${
              location.pathname === "/" ? "text-dorado font-bold" : ""
            }`}
          >
            Inicio
          </Link>
          <Link
            to="/productos"
            onClick={() => setIsMenuOpen(false)}
            className={`font-family-comfortaa block py-2 px-3 text-blanco rounded hover:bg-azul-2 hover:text-dorado hover:underline transition-colors duration-300 ${
              location.pathname === "/productos" ? "text-dorado font-bold" : ""
            }`}
          >
            Productos
          </Link>
          <Link
            to="/sobre-nosotros"
            onClick={() => setIsMenuOpen(false)}
            className={`font-family-comfortaa block py-2 px-3 text-blanco rounded hover:bg-azul-2 hover:text-dorado hover:underline transition-colors duration-300 ${
              location.pathname === "/sobre-nosotros"
                ? "text-dorado font-bold"
                : ""
            }`}
          >
            Nosotros
          </Link>
          <Link
            to="/contacto"
            onClick={() => setIsMenuOpen(false)}
            className={`font-family-comfortaa block py-2 px-3 text-blanco rounded hover:bg-azul-2 hover:text-dorado hover:underline transition-colors duration-300 ${
              location.pathname === "/contacto" ? "text-dorado font-bold" : ""
            }`}
          >
            Contacto
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Header;
