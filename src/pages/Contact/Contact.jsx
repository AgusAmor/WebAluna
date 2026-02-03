import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoIosSend } from "react-icons/io";
import { ImWhatsapp } from "react-icons/im";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import { Hero } from "../../components/common";
import { showCustomToast } from "../../services/ui/toastService";
import {
  sanitizeInput,
  isValidContactPhone,
  validateEmailExistence,
  validatePhoneMinDigits,
} from "../../services/validationService";

const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // Simulation of sending data
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Form data:", data);
      showCustomToast.success(
        "Mensaje enviado con éxito. Te responderemos a la brevedad.",
      );
      reset();
    } catch (error) {
      console.error("Error sending message:", error);
      showCustomToast.error(
        "Hubo un error al enviar el mensaje. Inténtalo nuevamente.",
      );
    }
  };

  const contactInfo = [
    {
      icon: ImWhatsapp,
      title: "WhatsApp",
      content: "+54 11 7358-4811",
      link: "https://wa.me/5491173584811",
      action: "Chatear",
    },
    {
      icon: FaInstagram,
      title: "Instagram",
      content: "@aluna_3d",
      link: "https://www.instagram.com/aluna_3d/",
      action: "Seguinos",
    },
    {
      icon: FaTiktok,
      title: "TikTok",
      content: "@aluna.3d",
      link: "https://www.tiktok.com/@aluna.3d",
      action: "Ver videos",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-3">
      <div className="max-w-[95%] mx-auto px-4 py-8">
        <Hero
          title="Contacto"
          subtitle="Estamos acá para ayudarte con tus dudas y pedidos"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mt-8">
          {/* Contact Form Section */}
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-bold font-family-comfortaa text-blue-1 mb-6">
              Envianos un mensaje
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-3 mb-1 font-family-sora"
                  >
                    Nombre <span className="text-gold text-xs">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register("name", {
                      required: "El nombre es obligatorio",
                    })}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-gold focus:border-transparent focus:outline-none transition-all font-family-sora ${
                      errors.name
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200"
                    }`}
                    placeholder="Tu nombre"
                  />
                  {errors.name && (
                    <span className="text-xs text-red-500 mt-1 font-family-sora">
                      {errors.name.message}
                    </span>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-3 mb-1 font-family-sora"
                  >
                    Teléfono
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    {...register("phone", {
                      validate: {
                        format: (value) =>
                          !value ||
                          isValidContactPhone(value) ||
                          "Solo se permiten números, +, -, espacios y paréntesis",
                        minLength: (value) =>
                          !value ||
                          validatePhoneMinDigits(value, 10) ||
                          "El teléfono debe tener al menos 10 números",
                      },
                    })}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-3 focus:border-transparent focus:outline-none transition-all font-family-sora ${
                      errors.phone
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200"
                    }`}
                    placeholder="Tu teléfono"
                  />
                  {errors.phone && (
                    <span className="text-xs text-red-500 mt-1 font-family-sora">
                      {errors.phone.message}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-3 mb-1 font-family-sora"
                >
                  Email <span className="text-gold text-xs">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "El email es obligatorio",
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Email inválido",
                    },
                    validate: {
                      sanitization: (value) =>
                        !value ||
                        sanitizeInput(value) === value ||
                        "El email contiene caracteres no permitidos",
                      existence: async (value) =>
                        await validateEmailExistence(value),
                    },
                  })}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-gold focus:border-transparent focus:outline-none transition-all font-family-sora ${
                    errors.email
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200"
                  }`}
                  placeholder="tucorreo@ejemplo.com"
                />
                {errors.email && (
                  <span className="text-xs text-red-500 mt-1 font-family-sora">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-3 mb-1 font-family-sora"
                >
                  Asunto <span className="text-gold text-xs">*</span>
                </label>
                <input
                  id="subject"
                  type="text"
                  {...register("subject", {
                    required: "El asunto es obligatorio",
                    validate: (value) =>
                      !value ||
                      sanitizeInput(value) === value ||
                      "El asunto contiene caracteres no permitidos",
                  })}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-gold focus:border-transparent focus:outline-none transition-all font-family-sora ${
                    errors.subject
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200"
                  }`}
                  placeholder="¿En qué podemos ayudarte?"
                />
                {errors.subject && (
                  <span className="text-xs text-red-500 mt-1 font-family-sora">
                    {errors.subject.message}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-3 mb-1 font-family-sora"
                >
                  Mensaje <span className="text-gold text-xs">*</span>
                </label>
                <textarea
                  id="message"
                  rows="5"
                  {...register("message", {
                    required: "El mensaje es obligatorio",
                    validate: (value) =>
                      !value ||
                      sanitizeInput(value) === value ||
                      "El mensaje contiene caracteres no permitidos",
                  })}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-gold focus:border-transparent focus:outline-none transition-all resize-none font-family-sora ${
                    errors.message
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200"
                  }`}
                  placeholder="Escribí tu mensaje aquí..."
                ></textarea>
                {errors.message && (
                  <span className="text-xs text-red-500 mt-1 font-family-sora">
                    {errors.message.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-1 hover:bg-gold hover:scale-105 text-white font-bold py-3 px-6 rounded-md transition-all duration-200 flex items-center justify-center gap-2 font-family-comfortaa disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <IoIosSend className="text-xl" />
                    Enviar Mensaje
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info Section */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
              <h2 className="text-2xl font-bold font-family-comfortaa text-blue-1 mb-6">
                Información de contacto
              </h2>
              <div className="space-y-6">
                <p className="text-blue-2 font-family-sora leading-relaxed">
                  ¿Tenés alguna consulta sobre nuestros productos o un pedido
                  personalizado? No dudes en contactarnos a través del
                  formulario o por nuestros canales directos.
                </p>

                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <a
                      key={index}
                      href={info.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group"
                    >
                      <div className="bg-blue-50 text-blue-1 p-3 rounded-full group-hover:bg-gold group-hover:text-white transition-colors duration-300">
                        <info.icon className="text-2xl" />
                      </div>
                      <div>
                        <h3 className="font-bold text-blue-2 font-family-comfortaa">
                          {info.title}
                        </h3>
                        <p className="text-blue-2 text-sm font-family-sora mb-1">
                          {info.content}
                        </p>
                        <span className="text-blue-1 text-xs font-semibold uppercase tracking-wider group-hover:underline">
                          {info.action}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
