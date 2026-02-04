import { Hero } from "../../components/common";
import isotipoImg from "../../assets/logos/isotipo.png";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-3">
      <div className="max-w-[95%] mx-auto px-4 py-8">
        <Hero
          title="Nosotros"
          subtitle="Conocé la historia y filosofía detrás de Aluna."
        />

        <div className="max-w-4xl mx-auto space-y-12 mt-8">
          {/* Historia */}
          <section className="bg-white rounded-2xl shadow-sm p-6 md:p-12 border border-gray-3/30">
            <h2 className="text-3xl font-bold text-blue-2 mb-6 font-family-comfortaa">
              Nuestra Historia
            </h2>
            <div className="space-y-4 text-gray-1 text-lg leading-relaxed">
              <p className="text-black">
                La historia de <strong>Aluna</strong> nace de una amistad sólida
                entre dos compañeros de secundaria. Como dos entusiastas de la
                tecnología, siempre compartimos una curiosidad innata por crear
                y desarrollar soluciones tecnológicas.
              </p>
              <p className="text-black">
                El punto de inflexión llegó cuando uno de nosotros compró su
                primera <strong>impresora 3D</strong>. La capacidad de
                materializar ideas digitales en objetos tangibles enamoró de
                inmediato al otro. Tras adquirir ambos nuestra propia impresora
                y experimentar con las infinitas posibilidades que ofrece, el
                hobby dio lugar a algo más.
              </p>
              <p className="text-black">
                Fue durante el verano de 2025, cuando uno de nosotros llamó al
                otro proponiéndole traer a la Argentina un modelo de negocio que
                ya existía en el extranjero. Desde entonces, hemos dedicado cada
                día al diseño, planificación y perfeccionamiento de una marca
                que represente nuestra identidad, especializándonos en la
                creación de <strong>lámparas de diseño</strong> únicas.
              </p>
            </div>
          </section>

          {/* Filosofía y Marca */}
          <section
            className="grid md:grid-cols-2 gap-8 items-center bg-cover bg-center rounded-2xl p-6 md:p-12 relative overflow-hidden"
            style={{
              backgroundImage:
                "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 600%22%3E%3Cdefs%3E%3ClinearGradient id=%22grad%22 x1=%220%25%22 y1=%220%25%22 x2=%22100%25%22 y2=%22100%25%22%3E%3Cstop offset=%220%25%22 style=%22stop-color:%2381a5ae;stop-opacity:0.15%22 /%3E%3Cstop offset=%22100%25%22 style=%22stop-color:%23c3c9ce;stop-opacity:0.15%22 /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=%221200%22 height=%22600%22 fill=%22url(%23grad)%22/%3E%3C/svg%3E')",
            }}
          >
            <div className="absolute inset-0 bg-white/70 rounded-2xl"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-blue-2 mb-6 font-family-comfortaa">
                Filosofía Aluna
              </h2>
              <div className="space-y-4 text-lg leading-relaxed">
                <p className="text-black">
                  Más que una tienda de iluminación, en Aluna buscamos{" "}
                  <strong>transmitir armonía</strong>. Entendemos la luz no solo
                  como una utilidad, sino como una forma de{" "}
                  <strong>transformar tu espacio</strong>, haciéndolo más
                  acogedor y personal.
                </p>
                <p className="text-black">
                  Nuestra línea estética se define por ser{" "}
                  <strong>elegante y minimalista</strong>. Desarrollamos
                  productos versátiles pensados para adaptarse a la vida
                  moderna, elevando el estilo de cualquier rincón de tu casa:
                  desde una oficina o estudio, hasta la calma de un dormitorio o
                  un living contemporáneo.
                </p>
              </div>
            </div>
            <div className="relative z-10 h-full min-h-[300px] bg-linear-to-br from-blue-2 to-gray-2 rounded-xl overflow-hidden shadow-inner flex flex-col items-center justify-center opacity-90 p-6 text-center transition-transform hover:scale-[1.02] duration-300">
              <img
                src={isotipoImg}
                alt="Isotipo Aluna"
                className="h-16 w-auto object-contain drop-shadow-lg mb-4 hover:scale-110 transition-transform duration-300 opacity-85"
              />
              <h3 className="font-family-comfortaa text-2xl font-bold text-white drop-shadow-md mb-2">
                Iluminación Decorativa
              </h3>
              <p className="text-white/90 font-light">
                Diseños 3D que transforman espacios
              </p>
            </div>
          </section>

          {/* Innovación y Futuro */}
          <section className="bg-white rounded-2xl shadow-sm p-6 md:p-12 border border-gray-3/30">
            <h2 className="text-3xl font-bold text-blue-2 mb-6 font-family-comfortaa">
              Innovación Constante
            </h2>
            <div className="space-y-4 text-gray-1 text-lg leading-relaxed">
              <p className="text-black">
                En <strong>Aluna</strong>, no nos conformamos. Siempre estamos
                buscando <strong>crecer e innovar</strong>, porque entendemos
                que el diseño es un lenguaje en constante evolución.
              </p>
              <p className="text-black">
                Nuestra mirada está puesta en el futuro, con el firme deseo de
                ampliar nuestra gama de productos. Proyectamos expandirnos
                dentro del universo de la{" "}
                <strong>decoración de interiores</strong> incorporando nuevas
                propuestas.
              </p>
            </div>
          </section>

          {/* SEO / Compromiso adicional (Opcional, para cerrar) */}
          <section className="text-center py-8">
            <p className="text-blue-2 font-medium text-xl font-family-comfortaa">
              "Lámparas impresas en 3D, hechas con intención."
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
