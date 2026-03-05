import React, { useState } from "react";
import { IoIosClose } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import { useModalScroll } from "../../../hooks/ui";

/**
 * TermsModal Component
 *
 * Modes:
 *  - "read"   : solo informativo, muestra un botón "Cerrar" (usado desde el Footer)
 *  - "accept" : requiere que el usuario marque el checkbox para poder confirmar
 *               (usado en Checkout antes de pagar)
 *
 * @param {boolean} isOpen - Si el modal está abierto
 * @param {"read"|"accept"} mode - Modo de presentación
 * @param {function} onClose - Callback al cerrar sin aceptar
 * @param {function} onAccept - Callback al aceptar (modo "accept")
 */
const TermsModal = ({ isOpen, mode = "read", onClose, onAccept }) => {
  const [accepted, setAccepted] = useState(false);

  useModalScroll(isOpen);

  if (!isOpen) return null;

  const handleClose = () => {
    setAccepted(false);
    onClose?.();
  };

  const handleAccept = () => {
    if (!accepted) return;
    setAccepted(false);
    onAccept?.();
  };

  return (
    <div className="fixed inset-0 z-50 font-family-sora">
      {/* Backdrop */}
      <div
        className="fixed inset-0 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(38,78,96,0.55)" }}
        onClick={handleClose}
      />

      {/* Modal container */}
      <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col pointer-events-auto animate-fadeInScale"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
            <h2 className="text-xl font-bold font-family-comfortaa text-blue-1">
              Términos y Condiciones
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-1 hover:text-blue-1 transition-colors p-1 rounded-full hover:bg-gray-100"
              aria-label="Cerrar"
            >
              <IoIosClose size={28} />
            </button>
          </div>

          {/* Content - scrollable */}
          <div className="overflow-y-auto px-6 py-5 text-sm text-blue-1 leading-relaxed space-y-5 flex-1">
            <section>
              <h3 className="font-bold text-base text-blue-1 mb-1">
                1. Naturaleza del servicio
              </h3>
              <p>
                Aluna es un emprendimiento dedicado al diseño y fabricación
                artesanal de lámparas decorativas mediante tecnología de
                impresión 3D.{" "}
                <strong>
                  Cada producto es elaborado a pedido exclusivamente
                </strong>
                : al momento de realizar un pedido el artículo no existe como
                stock previo, sino que se inicia su producción una vez
                confirmado y abonado el mismo. En consecuencia, el cliente
                acepta las condiciones propias de un servicio de fabricación
                personalizada.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-base text-blue-1 mb-1">
                2. Proceso de pedido y confirmación
              </h3>
              <p>
                Un pedido se considera <strong>confirmado</strong> cuando el
                pago es acreditado a través de Mercado Pago. A partir de ese
                momento Aluna comenzará la fabricación del producto. El cliente
                recibirá una notificación via mail con el número de pedido y
                podrá hacer seguimiento del estado desde su perfil en la
                plataforma.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-base text-blue-1 mb-1">
                3. Tiempos de fabricación y entrega
              </h3>
              <p>
                Los tiempos de fabricación son estimativos y pueden variar según
                la complejidad del diseño, la demanda y la disponibilidad de
                materiales. Aluna no se responsabiliza por demoras ocasionadas
                por terceros (fuerza mayor u otros eventos fuera de su control).
              </p>
              <p className="mt-1">
                Para envíos a domicilio, se le notificará dicho estado y nos
                pondremos en contacto para coordinar la entrega. Para retiro en
                local, se notificará al cliente cuando el pedido esté listo.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-base text-blue-1 mb-1">
                4. Cancelaciones y modificaciones
              </h3>
              <p>
                El cliente podrá solicitar la cancelación de su pedido desde la
                plataforma mientras el mismo no haya alcanzado el estado{" "}
                <strong>&quot;Imprimiendo&quot;</strong>. Una vez iniciada la
                producción, la opción de cancelación queda{" "}
                <strong>inhabilitada automáticamente</strong>. Si el cliente
                desea cancelar en esa instancia, deberá contactarse con Aluna
                directamente a través de los canales oficiales (WhatsApp o
                correo electrónico) para evaluar la situación en forma
                particular. En ningún caso se garantiza la cancelación una vez
                comenzada la fabricación.
              </p>
              <p className="mt-1">
                En caso de querer modificar un pedido, deberá contactarse con
                Aluna directamente a través de los canales oficiales previamente
                mencionados.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-base text-blue-1 mb-1">
                5. Política de devoluciones y garantía
              </h3>
              <p>
                Por la naturaleza del producto (fabricación personalizada a
                pedido), <strong>no se aceptan devoluciones ni cambios</strong>{" "}
                salvo en los siguientes casos:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                <li>
                  El producto llegó con defectos de fabricación que impidan su
                  uso normal.
                </li>
                <li>
                  El producto recibido no corresponde al pedido realizado.
                </li>
                <li>
                  El producto sufrió daños durante el transporte (con evidencia
                  fotográfica del embalaje al momento de recepción).
                </li>
              </ul>
              <p className="mt-2">
                Para iniciar un reclamo el cliente deberá contactarse dentro de
                las <strong>48 horas</strong> de recibido el pedido, adjuntando
                fotografías del producto y del embalaje. Aluna evaluará el caso
                y, de corresponder, gestionará la reposición o el reembolso.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-base text-blue-1 mb-1">
                6. Medios de pago
              </h3>
              <p>
                Los pagos se procesan exclusivamente a través de{" "}
                <strong>Mercado Pago</strong>, plataforma de terceros sujeta a
                sus propios términos de servicio. Aluna no almacena ni tiene
                acceso a los datos de tarjetas u otros instrumentos de pago del
                cliente. Cualquier inconveniente relacionado con el
                procesamiento del pago deberá gestionarse también con Mercado
                Pago.
              </p>
              <p>
                El pedido no pasará a producción hasta que el pago sea
                acreditado y confirmado.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-base text-blue-1 mb-1">
                7. Envíos
              </h3>
              <p>
                Los envíos a domicilio son realizados{" "}
                <strong>personalmente por el equipo de Aluna</strong>, lo que
                nos permite asegurar que el producto llegue en perfectas
                condiciones. Se coordina la entrega con el cliente a través de
                los datos de contacto provistos en el pedido.
              </p>
              <p className="mt-1">
                Se recomienda verificar el estado del producto al momento de
                recibirlo. Cualquier inconveniente deberá reportarse dentro de
                las <strong>48 horas</strong> de recibido el pedido.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-base text-blue-1 mb-1">
                8. Uso del producto
              </h3>
              <p>
                Las lámparas fabricadas por Aluna son de uso decorativo e
                interior. Cada producto es entregado{" "}
                <strong>completamente cableado y listo para usar</strong>: el
                cliente únicamente debe enchufarlo a la corriente eléctrica.
                Previo a su despacho, cada lámpara es{" "}
                <strong>probada y verificada</strong> para garantizar su
                correcto funcionamiento.
              </p>
              <p className="mt-1">
                Aluna no se responsabiliza por daños derivados de un uso
                inadecuado, modificaciones realizadas por el cliente al cableado
                o componentes eléctricos, ni por instalaciones eléctricas
                deficientes en el domicilio del cliente.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-base text-blue-1 mb-1">
                9. Propiedad intelectual
              </h3>
              <p>
                Todos los diseños, modelos, imágenes y contenidos de esta
                plataforma son propiedad de Aluna y están protegidos por las
                leyes de propiedad intelectual vigentes en Argentina. Queda
                prohibida su reproducción, distribución o uso comercial sin
                autorización expresa.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-base text-blue-1 mb-1">
                10. Datos personales
              </h3>
              <p>
                Los datos personales proporcionados por el cliente (nombre,
                correo electrónico, dirección, teléfono) serán utilizados
                exclusivamente para la gestión del pedido, comunicaciones
                relacionadas al mismo y la mejora del servicio. Aluna no
                compartirá estos datos con terceros. El cliente tiene derecho a
                solicitar acceso, rectificación o eliminación de sus datos
                contactando a Aluna por los canales oficiales.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-base text-blue-1 mb-1">
                11. Modificaciones a los términos
              </h3>
              <p>
                Aluna se reserva el derecho de modificar estos Términos y
                Condiciones en cualquier momento. Los cambios serán publicados
                en esta plataforma. El uso continuado del servicio tras la
                publicación de cambios implica la aceptación de los nuevos
                términos.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-base text-blue-1 mb-1">
                12. Pedidos mayoristas y convenios
              </h3>
              <p>
                Para pedidos en grandes cantidades, propuestas de convenio,
                colaboraciones comerciales o cualquier consulta de tipo
                mayorista, solicitamos que el cliente se comunique{" "}
                <strong>directamente con Aluna</strong> a través de los canales
                oficiales para acordar condiciones personalizadas.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-base text-blue-1 mb-1">
                13. Contacto y resolución de conflictos
              </h3>
              <p>
                Para cualquier consulta, reclamo o inquietud el cliente puede
                comunicarse con Aluna a través de:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                <li>
                  Correo electrónico:{" "}
                  <a
                    href="mailto:aluna.3d.design@gmail.com"
                    className="text-gold hover:underline"
                  >
                    aluna.3d.design@gmail.com
                  </a>
                </li>
                <li>
                  WhatsApp:{" "}
                  <a
                    href="https://wa.me/5491173584811"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:underline"
                  >
                    +54 11 7358-4811
                  </a>
                </li>
              </ul>
              <p className="mt-2">
                Te recordamos que estamos para ayudarte, así que no dudes en
                contactarnos ante cualquier consulta o inconveniente. Haremos
                todo lo posible por brindarte una solución rápida y
                satisfactoria simpre que se cumplan las condiciones. En caso de
                reclamos formales, se evaluará cada caso en particular para
                encontrar la mejor resolución posible.
              </p>
            </section>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 shrink-0">
            {mode === "accept" ? (
              <div className="space-y-4">
                {/* Checkbox */}
                <label className="flex items-center gap-3 cursor-pointer select-none group">
                  <div className="relative shrink-0">
                    <input
                      type="checkbox"
                      checked={accepted}
                      onChange={(e) => setAccepted(e.target.checked)}
                      className="sr-only peer"
                    />
                    <span className="w-5 h-5 flex items-center justify-center rounded border-2 border-gold bg-white transition-colors peer-checked:bg-gold peer-checked:border-gold group-hover:border-blue-2">
                      {accepted && <FaCheck className="w-3 h-3 text-white" />}
                    </span>
                  </div>
                  <span className="text-sm text-blue-1 leading-snug">
                    He leído y acepto los Términos y Condiciones.
                  </span>
                </label>
                {/* Buttons */}
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={handleClose}
                    className="px-5 py-2 rounded-lg border-2 border-gray-2 text-gray-1 font-bold text-sm hover:bg-gray-100 transition-colors font-family-sora"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAccept}
                    disabled={!accepted}
                    className="px-5 py-2 rounded-lg bg-gold text-white font-bold text-sm hover:bg-blue-2 transition-colors font-family-sora disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Confirmar y pagar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <button
                  onClick={handleClose}
                  className="px-6 py-2 rounded-lg bg-gold text-white font-bold text-sm hover:bg-blue-2 transition-colors font-family-sora"
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
