import {
  Navbar,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logotipo.png";

const Header = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculamos el progreso de scroll de 0 a 1
  const maxScroll = 200;
  const progress = Math.min(scrollY / maxScroll, 1);

  // Función de easing suave para evitar saltos
  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const smoothProgress = easeInOutCubic(progress);

  // Valores que cambian gradualmente
  const logoSize = 80 - 32 * smoothProgress;

  return (
    <header className="bg-white border-gray-200 dark:bg-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 ">
        {/* Layout con altura dinámica */}
        <div
          className="relative w-full flex items-start "
          style={{
            minHeight: `${logoSize * 2}px`,
          }}
        >
          {/* Logo - De centro a izquierda */}
          <div
            className="absolute transform -translate-x-1/2"
            style={{
              left: `${50 - 47 * smoothProgress}%`, // Centro (50%) → Izquierda (47%)
              top: `${20 + (1 - smoothProgress)}px`, // Más arriba cuando no hay scroll
              transition: "all 0.3s ease-out",
            }}
          >
            <Link to="/">
              <img
                src={logo}
                alt="LogoAluna"
                style={{
                  height: `${logoSize}px`,
                  transition: "height 0.3s ease-out",
                }}
              />
            </Link>
          </div>

          {/* Navbar - De centro (abajo del logo) a derecha */}
          <div
            className="absolute transform -translate-x-1/2"
            style={{
              left: `${50 + 40 * smoothProgress}%`, // Centro (50%) → Derecha (90%)
              top: `${logoSize + 30 - smoothProgress * (logoSize - 10)}px`, // Abajo del logo → Mismo nivel
              transition: "all 0.3s ease-out",
            }}
          >
            <Navbar fluid rounded className="bg-transparent border-none p-0">
              <div className="lg:hidden">
                <NavbarToggle />
              </div>

              <NavbarCollapse>
                <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-2 lg:space-y-0">
                  <NavbarLink as={Link} to="/" active>
                    Inicio
                  </NavbarLink>
                  <NavbarLink as={Link} to="/productos">
                    Productos
                  </NavbarLink>
                  <NavbarLink as={Link} to="/sobre-nosotros">
                    Nosotros
                  </NavbarLink>
                  <NavbarLink as={Link} to="/contacto">
                    Contacto
                  </NavbarLink>
                </div>
              </NavbarCollapse>
            </Navbar>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
