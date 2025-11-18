const { onRequest } = require("firebase-functions/v2/https");
const handleCors = require("./middlewares/corsMiddleware.js");
const { createUserDoc, verifyUserEmail } = require("./users.js");
const {
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
} = require("./products.js");
/**
 * Exposes the deleteProduct HTTPS function in the southamerica-east1 region.
 * Deletes a product and its image from Storage.
 */
exports.deleteProduct = onRequest(
  { region: "southamerica-east1" },
  async (req, res) => {
    if (handleCors(req, res)) return;
    await deleteProduct(req, res);
  }
);

/**
 * Exposes the createProduct HTTPS function in the southamerica-east1 region.
 * Handles CORS and delegates logic to the products controller.
 */
exports.createProduct = onRequest(
  { region: "southamerica-east1" },
  async (req, res) => {
    if (handleCors(req, res)) return;
    await require("./products.js").createProduct(req, res);
  }
);

/**
 * Exposes the verifyUserEmail HTTPS function in the southamerica-east1 region.
 * Handles CORS and delegates logic to the controller.
 */
exports.verifyUserEmail = onRequest(
  { region: "southamerica-east1" },
  async (req, res) => {
    if (handleCors(req, res)) return;
    await verifyUserEmail(req, res);
  }
);

/**
 * Exposes the createUserDoc HTTPS function in the southamerica-east1 region.
 * Handles CORS and delegates logic to the users controller.
 */
exports.createUserDoc = onRequest(
  { region: "southamerica-east1" },
  async (req, res) => {
    if (handleCors(req, res)) return;
    await createUserDoc(req, res);
  }
);

/**
 * Exposes the getProducts HTTPS function in the southamerica-east1 region.
 * Returns all products from Firestore.
 */
exports.getProducts = onRequest(
  { region: "southamerica-east1" },
  async (req, res) => {
    if (handleCors(req, res)) return;
    await getProducts(req, res);
  }
);

/**
 * Exposes the getProductById HTTPS function in the southamerica-east1 region.
 * Returns a product by ID from Firestore.
 */
exports.getProductById = onRequest(
  { region: "southamerica-east1" },
  async (req, res) => {
    if (handleCors(req, res)) return;
    await getProductById(req, res);
  }
);

/**
 * Exposes the updateProduct HTTPS function in the southamerica-east1 region.
 * Updates a product in Firestore by ID. Only admin users can update products.
 */
exports.updateProduct = onRequest(
  { region: "southamerica-east1" },
  async (req, res) => {
    if (handleCors(req, res)) return;
    await updateProduct(req, res);
  }
);
