const admin = require("./config/firebaseAdmin.js");
const handleCors = require("./middlewares/corsMiddleware.js");

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

  // Parse request body to ensure it's an object
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({ error: "Invalid JSON body" });
    }
  }

  // Extract and verify Firebase Auth token
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  let decoded;
  try {
    decoded = await admin.auth().verifyIdToken(token);
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }

  // Destructure product data from request body
  const { name, family, description, pricing, imageUrl } = body;
  console.log("[createProduct] Incoming request body:", {
    name,
    family,
    description,
    pricing,
    imageUrl,
  });
  if (!name || !family || !description || !pricing || !imageUrl) {
    console.error("[createProduct] Missing required product fields");
    return res.status(400).json({ error: "Missing required product fields" });
  }
  // Get UID of admin from token
  const createdBy = decoded.uid;
  try {
    // Save product document in Firestore
    const docRef = await admin.firestore().collection("products").add({
      name,
      family,
      description,
      pricing,
      imageUrl,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy,
    });
    // Get saved product with timestamps
    const savedDoc = await docRef.get();
    const product = { id: docRef.id, ...savedDoc.data() };
    res.json({ success: true, product });
  } catch (error) {
    console.error(`[createProduct] Error:`, error);
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
