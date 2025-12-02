const admin = require("./config/firebaseAdmin.js");
const { requireAdmin, verifyToken } = require("./utils/authUtils.js");
const { parseBody, validateId } = require("./utils/validation.js");
const { sendSuccess, handleError } = require("./utils/responseHandler.js");

/**
 * Updates a product in Firestore by ID.
 * POST /updateProduct
 * Body: { id, ...productData }
 * Only admin users are allowed to update products.
 */
exports.updateProduct = async (req, res) => {
  try {
    const body = parseBody(req.body);
    await requireAdmin(req);

    const { id, ...productData } = body;
    validateId(id, "Product id");

    await admin.firestore().collection("products").doc(id).update(productData);

    sendSuccess(res, { success: true });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Deletes a product from Firestore.
 * POST /deleteProduct
 * Body: { id: string }
 * Only admin users are allowed to delete products.
 */
exports.deleteProduct = async (req, res) => {
  try {
    const body = parseBody(req.body);
    await requireAdmin(req);

    const { id } = body;
    validateId(id, "Product id");

    await admin.firestore().collection("products").doc(id).delete();
    sendSuccess(res, { success: true });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Creates a product document in Firestore.
 * POST /createProduct
 * Body: { ...productData }
 * Requires admin privileges.
 */
exports.createProduct = async (req, res) => {
  try {
    const productData = parseBody(req.body);
    await requireAdmin(req);

    const docRef = await admin
      .firestore()
      .collection("products")
      .add(productData);

    sendSuccess(res, { success: true, id: docRef.id });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Returns all products from Firestore 'products' collection.
 * GET /products
 * No authentication required.
 */
exports.getProducts = async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection("products").get();
    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    sendSuccess(res, { products });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Returns a single product by ID from Firestore.
 * GET /products/:id
 * No authentication required.
 */
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    validateId(id, "Product id");

    const doc = await admin.firestore().collection("products").doc(id).get();
    if (!doc.exists) {
      throw { status: 404, message: "Product not found" };
    }
    sendSuccess(res, { id: doc.id, ...doc.data() });
  } catch (error) {
    handleError(res, error);
  }
};
