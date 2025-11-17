const admin = require("./config/firebaseAdmin.js");
const handleCors = require("./middlewares/corsMiddleware.js");

/**
 * POST /deleteProduct
 * Deletes a product from Firestore and its image from Firebase Storage
 * Expects: { id: string, imageUrl: string } in body, and Authorization header
 */
exports.deleteProduct = async (req, res) => {
  if (handleCors(req, res)) return;
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({ error: "Invalid JSON body" });
    }
  }
  const { id } = body;
  if (!id) {
    return res.status(400).json({ error: "Product id required" });
  }
  // Auth check
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  let decoded = null;
  try {
    decoded = await admin.auth().verifyIdToken(token);
    console.log("[deleteProduct] UID:", decoded.uid, "Claims:", decoded);
  } catch (err) {
    console.error("[deleteProduct] Token verification error:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
  // Check for admin claim
  let isAdmin = false;
  if (decoded && typeof decoded.admin !== "undefined") {
    isAdmin = decoded.admin;
  }
  if (!isAdmin) {
    console.error(
      "[deleteProduct] User is not admin:",
      decoded ? decoded.uid : null,
      "Decoded token:",
      decoded
    );
    return res
      .status(403)
      .json({ error: "User is not admin", claims: decoded });
  }
  try {
    // Delete Firestore document
    await admin.firestore().collection("products").doc(id).delete();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Creates a product document in Firestore.
 * Expects product data in request body (JSON).
 * Writes product data to the 'products' collection.
 * Validates Firebase Auth token from Authorization header.
 * Handles CORS and parses request body.
 */
exports.createProduct = async (req, res) => {
  // Handle CORS and preflight requests
  if (handleCors(req, res)) return;
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({ error: "Invalid JSON body" });
    }
  }
  const productData = body;
  // Auth check
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  let decoded;
  try {
    decoded = await admin.auth().verifyIdToken(token);
    console.log("[createProduct] UID:", decoded.uid, "Claims:", decoded);
  } catch (err) {
    console.error("[createProduct] Token verification error:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
  // Check for admin claim
  let isAdmin = false;
  if (decoded && typeof decoded.admin !== "undefined") {
    isAdmin = decoded.admin;
  }
  if (!isAdmin) {
    console.error(
      "[createProduct] User is not admin:",
      decoded ? decoded.uid : null,
      "Decoded token:",
      decoded
    );
    return res
      .status(403)
      .json({ error: "User is not admin", claims: decoded });
  }
  try {
    const docRef = await admin
      .firestore()
      .collection("products")
      .add(productData);
    res.json({ success: true, id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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
