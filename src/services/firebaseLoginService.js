import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "./firebase.js";

class LoginService {
  constructor() {
    this.auth = getAuth(app);
  }

  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      console.log("Usuario autenticado:", userCredential.user);
      return userCredential.user;
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      throw error;
    }
  }
}

export default new LoginService();