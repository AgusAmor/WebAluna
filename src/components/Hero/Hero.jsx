import "./hero.css";
import { useLocation } from "react-router-dom";

export function Hero({ title, subtitle }) {
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");
  return (
    <div
      className={`hero-container ${isAdminPage ? "admin-hero-container" : ""}`}
    >
      <h1>{title}</h1>
      <small>{subtitle}</small>
    </div>
  );
}
