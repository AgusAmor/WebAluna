import { useState } from "react";
import { Link } from "react-router-dom";
import { LoginModal } from "../LoginModal/LoginModal";
import { useAuth } from "../../context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./header.css";

export function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const { isLogged, logout } = useAuth();

  return (
    <>
      <header className="header">
        <div className="logo">
          <a href="/">
            <img src="/img/logo.png" alt="Logo" />
          </a>
        </div>

        <nav className="nav-container">
          <ul className="navbar">
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/catalogo">Catálogo</Link>
            </li>
          </ul>

          {isLogged ? (
            <button
              className="login-btn"
              onClick={logout}
              aria-label="Cerrar sesión"
            >
              Logout
            </button>
          ) : (
            <button
              className="login-btn"
              onClick={() => setShowLogin(true)}
              aria-label="Iniciar sesión"
            >
              Login
            </button>
          )}
        </nav>
      </header>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLogin={(user) => {
            console.log("Usuario logueado:", user);
            localStorage.setItem("userLogged", JSON.stringify(user));
            setShowLogin(false);
          }}
        />
      )}
    </>
  );
}
