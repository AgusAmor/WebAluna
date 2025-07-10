import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Header } from "./components/Header/Header";
import { HomePage } from "./pages/home/HomePage";
import { CatalogPage } from "./pages/catalog/CatalogPage";
import { HomeAdmin } from "./admin/home/HomeAdmin";
// import { Users } from "./admin/users/Users";
// import { Products } from "./admin/products/Products";

export function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/admin" element={<HomeAdmin />} />
        {/* <Route path="/admin/usuarios" element={<Users />} />
        <Route path="/admin/productos" element={<Products />} /> */}
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </BrowserRouter>
  );
}
