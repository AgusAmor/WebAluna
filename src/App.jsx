import AppRouter from "./router/AppRouter.jsx";
import { CartProvider } from "./context/CartContext.jsx";

function App() {
  return (
    <CartProvider>
      <div className="App">
        <AppRouter />
      </div>
    </CartProvider>
  );
}

export default App;
