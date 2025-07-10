import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);

  const isAdmin = () => isLogged && user?.type === "ADMIN";

  useEffect(() => {
    const storedUser = localStorage.getItem("userLogged");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLogged(true);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsLogged(true);
    localStorage.setItem("userLogged", JSON.stringify(userData));
    toast.success("Bienvenido " + userData.username, {
      icon: (
        <img
          src="../../public/img/iso.png"
          alt="iso"
          style={{ width: 24, height: 24 }}
        />
      ),
    });
  };

  const logout = () => {
    setUser(null);
    setIsLogged(false);
    localStorage.removeItem("userLogged");
    toast.success("Se cerró la sesión", {
      icon: (
        <img
          src="../../public/img/iso.png"
          alt="iso"
          style={{ width: 24, height: 24 }}
        />
      ),
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLogged, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
