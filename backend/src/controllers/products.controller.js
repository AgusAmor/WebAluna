import { db } from "../config/firebase.js";

// Obtener todos los productos
export const getAllProducts = async (req, res) => {
  try {
    const productsRef = db.collection("products");
    const snapshot = await productsRef.get();

    const products = [];
    snapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
};

// Obtener un producto por Id
export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await db.collection("products").doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ message: "Error al obtener producto" });
  }
};

// Crear un nuevo producto
export const createProduct = async (req, res) => {
  const newProduct = req.body;

  try {
    const docRef = await db.collection("products").add(newProduct);
    res.status(201).json({ id: docRef.id, ...newProduct });
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ message: "Error al crear producto" });
  }
};

// Actualizar un producto
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const docRef = db.collection("products").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    await docRef.update(updatedData);
    res.status(200).json({ id, ...updatedData });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ message: "Error al actualizar producto" });
  }
};

// Eliminar un producto por Id
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const docRef = db.collection("products").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    await docRef.delete();
    res.status(200).json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ message: "Error al eliminar producto" });
  }
};
