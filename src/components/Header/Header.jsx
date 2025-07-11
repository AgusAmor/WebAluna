import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LoginModal } from "../loginModal/LoginModal";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./header.css";

export function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const { isLogged, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");

  const handleSwitchView = () => {
    navigate(isAdminPage ? "/" : "/admin");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <header className={`header ${isAdminPage ? "admin-header" : ""}`}>
        <div className="logo">
          {isAdminPage ? (
            <Link to="/admin">
              <img src="/img/logoAdmin.png" alt="Logo Admin" />
            </Link>
          ) : (
            <Link to="/">
              <img src="/img/logo.png" alt="Logo" />
            </Link>
          )}
        </div>

        <nav className="nav-container">
          <ul className="navbar">
            {isAdminPage ? (
              <>
                <li>
                  <Link to="/admin">Dashboard</Link>
                </li>
                <li>
                  <Link to="/admin/productos">Productos</Link>
                </li>
                <li>
                  <Link to="/admin/usuarios">Usuarios</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/">Inicio</Link>
                </li>
                <li>
                  <Link to="/catalogo">Catálogo</Link>
                </li>
              </>
            )}
          </ul>

          {isAdmin() && (
            <button
              className="admin-switch-btn"
              onClick={handleSwitchView}
              aria-label="Cambiar vista"
            >
              {isAdminPage ? "Home" : "Panel"}
            </button>
          )}

          {isLogged ? (
            <button className="login-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button className="login-btn" onClick={() => setShowLogin(true)}>
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

            if (user.type === "ADMIN") {
              navigate("/admin");
            } else {
              navigate("/");
            }
          }}
        />
      )}
    </>
  );
}
