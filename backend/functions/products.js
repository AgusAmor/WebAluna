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
    const decoded = await requireAdmin(req);

    const { id, ...productData } = body;
    validateId(id, "Product id");

    // Add updatedAt timestamp
    const dataWithMetadata = {
      ...productData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await admin
      .firestore()
      .collection("products")
      .doc(id)
      .update(dataWithMetadata);

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
    const decoded = await requireAdmin(req);

    // Add metadata: createdAt, updatedAt, createdBy
    const productWithMetadata = {
      ...productData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: decoded.uid,
    };

    const docRef = await admin
      .firestore()
      .collection("products")
      .add(productWithMetadata);

    sendSuccess(res, { success: true, id: docRef.id });
  } catch (error) {
    handleError(res, error);
  }
};
