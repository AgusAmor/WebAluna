import { Link } from "react-router-dom";
import { Hero } from "../../components/Hero/Hero";
import "./homeAdmin.css";

export function HomeAdmin() {
  return (
    <>
      <div className="admin-container">
        <Hero
          title="Panel de Administración"
          subtitle="Gestioná a los usuarios y productos"
        />

        <div className="admin-cards">
          <Link to="/admin/productos" className="admin-card">
            <h2>Productos</h2>
            <p>Gestionar productos del catálogo</p>
          </Link>

          <Link to="/admin/usuarios" className="admin-card">
            <h2>Usuarios</h2>
            <p>Administrar usuarios registrados</p>
          </Link>
        </div>
      </div>
    </>
  );
}
