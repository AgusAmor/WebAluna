import { Hero } from "../../components/Hero/Hero";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

export function HomePage() {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("Error al cargar productos:", err));
  }, []);

  const irACatalogo = () => navigate("/catalogo");

  return (
    <div className="home-container">
      <Hero
        title="Hola, somos Aluna"
        subtitle="Descubrí quiénes somos y cómo te ayudamos a iluminar tu espacio"
      />

      <section className="about-container">
        <div>
          <h2>¿Qué hacemos?</h2>
          <p>
            En Aluna nos dedicamos al diseño, manufactura y distribución de
            lámparas con impresión 3D, donde combinamos tecnología con
            creatividad artesanal. Cada pieza tiene su propio proceso, tiempo e
            identidad, no solo iluminan un espacio, sino que también generan una
            atmósfera única y personal. Las hacemos con intención, pensando en
            que el lugar se sienta realmente tuyo, aportando armonía y comodidad
            a tu hogar. Nuestro compromiso es crear productos innovadores, con
            calidad y detalle, que transformen cualquier ambiente.
          </p>
        </div>

        <h2>Nuestros productos</h2>
        <div className="carousel-container">
          <div className="carousel">
            {[...productos, ...productos].map((producto, index) => (
              <div key={index} className="carousel-item" onClick={irACatalogo}>
                <img src={producto.img} alt={producto.name} />
                <p>{producto.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2>¿Quiénes somos?</h2>
          <p>
            Somos dos amigos con una pasión común por la impresión 3D y el
            diseño, decidimos asociarnos, combinando nuestras habilidades para
            crear un proyecto que trascienda. Buscamos aportar soluciones
            originales a través de la tecnología, al mismo tiempo que fomentamos
            la creatividad y la sostenibilidad. Aluna es más que un
            emprendimiento: es el resultado de nuestra amistad, esfuerzo y
            visión de transformar ideas en productos tangibles que marcan la
            diferencia.
          </p>
        </div>
      </section>
    </div>
  );
}
