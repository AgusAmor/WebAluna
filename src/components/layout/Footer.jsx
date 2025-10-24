import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">🌙 Aluna</h3>
            <p className="text-gray-400 text-sm">
              Lámparas únicas con impresión 3D. Combinamos tecnología y
              creatividad artesanal para transformar cualquier ambiente.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white text-sm">
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/productos"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Productos
                </Link>
              </li>
              <li>
                <Link
                  to="/carrito"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Carrito
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Atención al Cliente</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Lun - Vie: 9:00 - 18:00</li>
              <li>Sáb: 9:00 - 14:00</li>
              <li>
                <a href="mailto:info@aluna.com" className="hover:text-white">
                  info@aluna.com
                </a>
              </li>
              <li>
                <a href="tel:+541112345678" className="hover:text-white">
                  +54 11 1234-5678
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold mb-4">Síguenos</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                📘
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Instagram</span>
                📷
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                🐦
              </a>
            </div>
          </div>
        </div>

        <hr className="border-gray-700 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Aluna. Todos los derechos reservados.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link
              to="/privacidad"
              className="text-gray-400 hover:text-white text-sm"
            >
              Política de Privacidad
            </Link>
            <Link
              to="/terminos"
              className="text-gray-400 hover:text-white text-sm"
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
