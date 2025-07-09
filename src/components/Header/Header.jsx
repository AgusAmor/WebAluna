import { Link } from "react-router-dom";
import "./header.css";

export function Header() {
  return (
    <header className="header">
      <div className="logo">
        <a href="/">
          <img src="/img/logo.png" alt="Logo" />
        </a>
      </div>

      <nav>
        <ul className="navbar">
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li>
            <Link to="/catalogo">Catálogo</Link>
          </li>
          <li>
            <Link to="/carrito">Carrito</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
