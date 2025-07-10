import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./LoginModal.css";

export function LoginModal({ onClose }) {
  const { login } = useAuth();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    fetch(
      `http://localhost:3000/users?username=${username}&password=${password}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 1) {
          login(data[0]);
          onClose();
        } else {
          setError("Usuario o contraseña incorrectos.");
        }
      })
      .catch(() => {
        setError("Error al iniciar sesión.");
      });
  };

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Ingresar</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}
