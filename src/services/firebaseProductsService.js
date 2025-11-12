import { db, storage } from "../services/firebaseAdmin.js";

// Obtener todos los productos
const getAllProducts = async () => {
  try {
    const productsRef = db.collection("products");
    const snapshot = await getDocs(productsRef);

    const products = [];
    snapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });

    return products;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw new Error("Error al obtener productos");
  }
};

// Obtener un producto por Id
const getProductById = async (id) => {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Producto no encontrado");
    }

    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error("Error al obtener producto:", error);
    throw new Error("Error al obtener producto");
  }
};

// Crear un nuevo producto
const createProduct = async (newProduct) => {
  try {
    let imageUrl = null;

    // Subir imagen a Firebase Storage si existe
    if (newProduct.image && newProduct.image instanceof File) {
      const storageRef = storage.bucket().file(`products/${newProduct.image.name}`);
      await storageRef.save(newProduct.image);
      imageUrl = storageRef.publicUrl();
    }

    // Verificar si se subió correctamente la imagen
    if (imageUrl) {
      console.log("✅ Imagen subida correctamente. URL:", imageUrl);
    } else {
      console.log("⚠️ No se subió ninguna imagen.");
    }

    // Filtrar datos innecesarios antes de guardar
    const productToSave = {
      name: newProduct.name,
      family: newProduct.family,
      description: newProduct.description,
      pricing: {
        normal: {
          price: newProduct.pricing.normal.price,
          size: newProduct.pricing.normal.size,
        },
        small: {
          price: newProduct.pricing.small.price,
          size: newProduct.pricing.small.size,
        },
      },
      image: imageUrl, // Guardar solo la URL de la imagen
    };

    console.log("📦 Preparando datos para Firestore:", productToSave);

    const productsRef = db.collection("products");
    const docRef = await productsRef.add(productToSave);

    console.log("✅ Producto guardado en Firestore. ID:", docRef.id);

    return { id: docRef.id, ...productToSave };
  } catch (error) {
    console.error("❌ Error al guardar producto en Firestore:", error);
    throw new Error("Error al guardar producto");
  }
};

// Actualizar un producto
const updateProduct = async (id, data) => {
  try {
    const docRef = doc(db, "products", id);
    await updateDoc(docRef, data);
    return { id, ...data };
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    throw new Error("Error al actualizar producto");
  }
};

// Eliminar un producto por Id
const deleteProduct = async (id) => {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Producto no encontrado");
    }

    await deleteDoc(docRef);
    return { message: "Producto eliminado correctamente" };
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    throw new Error("Error al eliminar producto");
  }
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
