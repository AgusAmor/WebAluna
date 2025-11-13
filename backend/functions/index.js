const { onRequest } = require("firebase-functions/v2/https");
const handleCors = require("./middlewares/corsMiddleware.js");
const { createUserDoc } = require("./users.js");

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
