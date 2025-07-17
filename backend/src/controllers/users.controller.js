import { admin, db } from "../../config/firebase.js";

// Login
export const loginUser = async (req, res) => {
  const { idToken } = req.body;

  try {
    console.log("Recibido token:", idToken);

    const decodedToken = await admin.auth().verifyIdToken(idToken);

    console.log("Token decodificado:", decodedToken);

    const uid = decodedToken.uid;
    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res
        .status(404)
        .json({ message: "Usuario no encontrado en Firestore" });
    }

    const userData = userDoc.data();
    console.log("Datos del usuario:", userData);

    return res.status(200).json(userData);
  } catch (error) {
    console.error("Error al verificar token:", error.code, error.message);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

// Registrar nuevo usuario
export const registerUser = async (req, res) => {
  try {
    const { email, password, userName, name, surname, phone, type } = req.body;

    // verificacion de userName
    const existing = await db
      .collection("users")
      .where("userName", "==", userName)
      .get();

    if (!existing.empty) {
      return res
        .status(400)
        .json({ message: "El nombre de usuario ya existe" });
    }

    // crear en FireBase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: `${name} ${surname}`,
    });

    // crear Firestore con UID del Auth
    const userData = {
      id: userRecord.uid,
      email,
      userName,
      name,
      surname,
      phone,
      type,
    };

    await db.collection("users").doc(userRecord.uid).set(userData);

    return res.status(201).json({ uid: userRecord.uid, ...userData });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return res.status(500).json({ message: "Error al registrar usuario" });
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
  const { id } = req.params;
  const { email, name, surname, phone, type, userName } = req.body;

  try {
    // Firebase Auth
    await admin.auth().updateUser(id, {
      email,
      displayName: `${name} ${surname}`,
    });

    // Firestore
    const updatedData = {
      id,
      email,
      userName,
      name,
      surname,
      phone,
      type,
    };

    await db.collection("users").doc(id).update(updatedData);

    return res.status(200).json({ id, ...updatedData });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return res.status(500).json({ message: "Error al actualizar usuario" });
  }
};

// Eliminar usuario
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Firebase Auth
    await admin.auth().deleteUser(id);

    // Firestore
    await db.collection("users").doc(id).delete();

    return res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return res.status(500).json({ message: "Error al eliminar usuario" });
  }
};
