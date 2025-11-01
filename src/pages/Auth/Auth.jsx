import React, { useState } from "react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gris-3 flex items-center justify-center font-family-sora">
      <div className="bg-blanco p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold font-family-comfortaa text-azul-1">
            {isLogin ? "Iniciar Sesión" : "Registrarse"}
          </h1>
          <p className="text-gris-1 mt-2">
            {isLogin ? "Accede a tu cuenta" : "Crea una nueva cuenta"}
          </p>
        </div>

        <form className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-1 text-azul-1">
                Nombre completo
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gris-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-2"
                placeholder="Tu nombre completo"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1 text-azul-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gris-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-2"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-azul-1">
              Contraseña
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gris-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-2"
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-1 text-azul-1">
                Confirmar contraseña
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gris-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-azul-2"
                placeholder="••••••••"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-azul-2 text-blanco py-2 rounded-lg hover:bg-dorado transition-colors font-semibold"
          >
            {isLogin ? "Iniciar Sesión" : "Registrarse"}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-azul-2 hover:text-dorado hover:underline transition-colors"
          >
            {isLogin
              ? "¿No tienes cuenta? Regístrate"
              : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
