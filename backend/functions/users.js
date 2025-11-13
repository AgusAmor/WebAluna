const admin = require("./config/firebaseAdmin.js");
const handleCors = require("./middlewares/corsMiddleware.js");

/**
 * Creates a user document in Firestore.
 * Expects: uid and email in request body (JSON).
 * Writes user data to the 'users' collection.
 * Validates Firebase Auth token from Authorization header.
 * Handles CORS and parses request body.
 */

exports.createUserDoc = async (req, res) => {
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

  // Extract and verify Firebase Auth token from Authorization header
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

  // Destructure user data from request body
  const { email, displayName, uid, lastLoginAt, ...rest } = body;
  if (!uid || !email) {
    return res.status(400).json({ error: "uid and email are required" });
  }
  try {
    // Save user document in Firestore
    await admin
      .firestore()
      .collection("users")
      .doc(uid)
      .set({
        email,
        displayName: displayName || "",
        ...rest,
        lastLoginAt: lastLoginAt
          ? admin.firestore.Timestamp.fromDate(new Date(lastLoginAt))
          : admin.firestore.FieldValue.serverTimestamp(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
