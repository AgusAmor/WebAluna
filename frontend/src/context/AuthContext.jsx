import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../config/firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { toast } from "react-toastify";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);

  const isAdmin = () => isLogged && user?.type === "ADMIN";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken(true);

        const res = await fetch("http://localhost:5000/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });

        const data = await res.json();
        if (res.ok) {
          setUser(data);
          setIsLogged(true);
          localStorage.setItem("userLogged", JSON.stringify(data));
        } else {
          console.error("Error al validar usuario:", data.message);
          logout();
        }
      } else {
        setUser(null);
        setIsLogged(false);
        localStorage.removeItem("userLogged");
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Inicio de sesión exitoso", {
        icon: (
          <img src="/img/iso.png" alt="iso" style={{ width: 24, height: 24 }} />
        ),
      });
    } catch (error) {
      toast.error("Email o contraseña incorrectos.", {
        icon: (
          <img src="/img/iso.png" alt="iso" style={{ width: 24, height: 24 }} />
        ),
      });
      console.error(error);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setIsLogged(false);
    localStorage.removeItem("userLogged");
    toast.success("Se cerró la sesión", {
      icon: (
        <img src="/img/iso.png" alt="iso" style={{ width: 24, height: 24 }} />
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
