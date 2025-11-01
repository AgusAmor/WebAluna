import AppRouter from "./router/AppRouter";
import { CartProvider } from "./context/CartContext";

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
