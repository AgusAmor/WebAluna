import { useLocation } from "react-router-dom";
import "./hero.css";

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
