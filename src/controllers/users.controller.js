import { db } from "../config/firebase.js";

// Login
export const loginUser = async (req, res) => {
  const { idToken } = req.body;

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Traer datos desde Firestore
    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res
        .status(404)
        .json({ message: "Usuario no encontrado en Firestore" });
    }

    const userData = userDoc.data();
    return res.status(200).json(userData);
  } catch (error) {
    console.error("Error al verificar token:", error);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

// Registrar nuevo usuario
export const registerUser = async (req, res) => {
  try {
    const newUser = req.body;

    const existing = await db
      .collection("users")
      .where("username", "==", newUser.username)
      .get();

    if (!existing.empty) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const docRef = await db.collection("users").add(newUser);
    res.status(201).json({ id: docRef.id, ...newUser });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    const users = [];

    snapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// Actualizar usuario
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    await db.collection("users").doc(id).update(data);
    res.status(200).json({ id, ...data });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};

// Eliminar usuario
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection("users").doc(id).delete();
    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};
