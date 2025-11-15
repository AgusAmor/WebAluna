const admin = require("./config/firebaseAdmin.js");
const handleCors = require("./middlewares/corsMiddleware.js");

/**
 * GET /products
 * Returns all products from Firestore 'products' collection
 */
exports.getProducts = async (req, res) => {
  if (handleCors(req, res)) return;
  try {
    const snapshot = await admin.firestore().collection("products").get();
    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /products/:id
 * Returns a single product by ID from Firestore
 */
exports.getProductById = async (req, res) => {
  if (handleCors(req, res)) return;
  const { id } = req.params;
  try {
    const doc = await admin.firestore().collection("products").doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
