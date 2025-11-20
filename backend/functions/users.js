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

exports.verifyUserEmail = async (req, res) => {
  if (handleCors(req, res)) return;

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({ error: "Invalid JSON body" });
    }
  }

  const { email } = body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await admin.auth().getUserByEmail(email);
    return res.json({ exists: true });
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      return res.json({ exists: false });
    }
    return res.status(500).json({ error: error.message });
  }
};

exports.changePassword = async (uid, newPassword) => {
  try {
    await admin.auth().updateUser(uid, { password: newPassword });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Retrieves all user documents from Firestore.
 * GET /users
 * No authentication required.
 */
exports.getUsers = async (req, res) => {
  // Handles CORS and preflight requests
  if (handleCors(req, res)) return;
  try {
    // Retrieves all user documents from Firestore
    const snapshot = await admin.firestore().collection("users").get();
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieves a user document by ID from Firestore.
 * GET /users/:id
 * No authentication required.
 */
exports.getUserById = async (req, res) => {
  // Handles CORS and preflight requests
  if (handleCors(req, res)) return;
  const { id } = req.params;
  try {
    // Retrieves user document by ID
    const doc = await admin.firestore().collection("users").doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Deletes a user document by ID from Firestore.
 * POST /deleteUser
 * Only admin users can delete users.
 */
exports.deleteUser = async (req, res) => {
  // Handles CORS and preflight requests
  if (handleCors(req, res)) return;
  let body = req.body;
  // Parses request body to ensure it's an object
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({ error: "Invalid JSON body" });
    }
  }
  const { id } = body;
  if (!id) {
    return res.status(400).json({ error: "User id required" });
  }
  // Checks for admin authentication
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  let decoded = null;
  try {
    decoded = await admin.auth().verifyIdToken(token);
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
  let isAdmin = false;
  if (decoded && typeof decoded.admin !== "undefined") {
    isAdmin = decoded.admin;
  }
  if (!isAdmin) {
    return res
      .status(403)
      .json({ error: "User is not admin", claims: decoded });
  }
  try {
    // Deletes user document from Firestore
    await admin.firestore().collection("users").doc(id).delete();
    // Deletes user from Firebase Authentication
    await admin.auth().deleteUser(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
