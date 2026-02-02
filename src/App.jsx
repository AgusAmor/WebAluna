import { useEffect } from "react";
import AppRouter from "./router/AppRouter";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { initializeMercadoPago } from "./services/mercadopagoService";

function App() {
  // Initialize Mercado Pago SDK on app startup
  useEffect(() => {
    const publicKey = import.meta.env.VITE_MP_PUBLIC_KEY;
    if (publicKey) {
      initializeMercadoPago(publicKey);
    }
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <div className="App">
          <AppRouter />
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
