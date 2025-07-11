import "./footer.css";
import {
  FaInstagram,
  FaWhatsapp,
  FaTiktok,
  FaMapMarkerAlt,
  FaEnvelope,
} from "react-icons/fa";
import { useLocation } from "react-router-dom";

export function Footer() {
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");
  return (
    <>
      {!isAdminPage ? (
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section contact">
              <h3>Contacto</h3>
              <p>
                <FaMapMarkerAlt /> Villa Urquiza, CABA
              </p>
              <p>
                <FaEnvelope /> aluna.3d.design@gmail.com
              </p>
            </div>

            <div className="footer-section social">
              <h3>Redes Sociales</h3>
              <div className="social-icons">
                <a href="https://instagram.com/aluna_3d" target="_blank">
                  <FaInstagram />
                </a>
                <a href="#" target="_blank">
                  <FaWhatsapp />
                </a>
                <a href="#" target="_blank">
                  <FaTiktok />
                </a>
              </div>
            </div>

            <div className="footer-section extra">
              <h3>Aluna</h3>
              <p>Lámparas impresas en 3D, hechas con intención.</p>
              <p>
                &copy; {new Date().getFullYear()} Aluna. Todos los derechos
                reservados.
              </p>
            </div>
          </div>
        </footer>
      ) : null}
    </>
  );
}
