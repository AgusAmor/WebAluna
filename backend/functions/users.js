const admin = require("./config/firebaseAdmin.js");
const { verifyToken, isAdmin, requireAdmin } = require("./utils/authUtils.js");
const {
  parseBody,
  validateEmail,
  validateId,
  validateRequiredFields,
} = require("./utils/validation.js");
const { sendSuccess, handleError } = require("./utils/responseHandler.js");

/**
 * Creates a user document in Firestore.
 * POST /createUserDoc
 * Body: { uid, email, displayName, ...rest }
 * New users always have admin: false
 */
exports.createUserDoc = async (req, res) => {
  try {
    const body = parseBody(req.body);
    const decoded = await verifyToken(req.headers.authorization);

    const { email, displayName, uid, lastLoginAt, ...rest } = body;

    // Validate required fields
    if (!uid || !email) {
      throw { status: 400, message: "uid and email are required" };
    }
    validateEmail(email);

    // Ensure uid matches authenticated user
    if (uid !== decoded.uid) {
      throw {
        status: 403,
        message: "Cannot create user document for another user",
      };
    }

    // Create user document with admin: false
    await admin
      .firestore()
      .collection("users")
      .doc(uid)
      .set({
        email,
        displayName: displayName || "",
        ...rest,
        admin: false,
        lastLoginAt: lastLoginAt
          ? admin.firestore.Timestamp.fromDate(new Date(lastLoginAt))
          : admin.firestore.FieldValue.serverTimestamp(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    sendSuccess(res, { success: true });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Verifies if an email exists in Firebase Authentication.
 * POST /verifyUserEmail
 * Body: { email: string }
 */
exports.verifyUserEmail = async (req, res) => {
  try {
    const body = parseBody(req.body);
    validateEmail(body.email);

    try {
      await admin.auth().getUserByEmail(body.email);
      sendSuccess(res, { exists: true });
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        sendSuccess(res, { exists: false });
      } else {
        throw error;
      }
    }
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Retrieves all user documents from Firestore.
 * GET /users
 */
exports.getUsers = async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection("users").get();
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    sendSuccess(res, { users });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Retrieves a user document by ID from Firestore.
 * GET /getUserById?id=userId
 */
exports.getUserById = async (req, res) => {
  try {
    const id = req.query.id;
    validateId(id, "User ID");

    const doc = await admin.firestore().collection("users").doc(id).get();
    if (!doc.exists) {
      throw { status: 404, message: "User not found" };
    }
    sendSuccess(res, { id: doc.id, ...doc.data() });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Deletes a user document and Firebase Auth user.
 * POST /deleteUser
 * Body: { id: string }
 * Only admin users can delete users.
 */
exports.deleteUser = async (req, res) => {
  try {
    const body = parseBody(req.body);
    const decoded = await requireAdmin(req);
    validateId(body.id, "user id");

    // Delete from Firestore and Auth
    await admin.firestore().collection("users").doc(body.id).delete();
    await admin.auth().deleteUser(body.id);

    sendSuccess(res, { success: true });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Updates a user document in Firestore and Firebase Auth.
 * POST /updateUserDoc?id=userId
 * Only users can update their own profile, admins can update any user.
 */
exports.updateUserDoc = async (req, res) => {
  try {
    const body = parseBody(req.body);
    const decoded = await verifyToken(req.headers.authorization);

    let id = req.params?.id || req.query?.id;
    validateId(id, "user id");

    // Check authorization
    const userIsAdmin = isAdmin(decoded);
    if (!userIsAdmin && decoded.uid !== id) {
      throw {
        status: 403,
        message: "Cannot update another user's profile",
      };
    }

    const {
      displayName = "",
      email = "",
      role = "user",
      accountStatus = "active",
      phone = "",
      admin: requestedAdmin = false,
      addresses = [],
    } = body;

    // Validate required fields
    validateRequiredFields({ displayName, email, role, accountStatus }, [
      "displayName",
      "email",
      "role",
      "accountStatus",
    ]);

    // Update Firebase Auth first
    try {
      await admin.auth().updateUser(id, {
        displayName,
        email,
        phoneNumber: phone,
      });
    } catch (authError) {
      throw {
        status: 400,
        message: authError.message || "Failed to update user in Auth",
      };
    }

    // Prepare Firestore update
    const firestoreUpdate = {
      displayName,
      email,
      role,
      accountStatus,
      phone,
      addresses,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Only admins can modify admin field
    if (userIsAdmin) {
      firestoreUpdate.admin = requestedAdmin;

      // Sync custom claims
      if (requestedAdmin !== userIsAdmin) {
        await admin.auth().setCustomUserClaims(id, { admin: requestedAdmin });
      }
    }

    // Update Firestore
    await admin.firestore().collection("users").doc(id).update(firestoreUpdate);

    sendSuccess(res, { success: true });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Sets a user as admin or removes admin privileges.
 * POST /setAdminRole
 * Body: { userId: string, isAdmin: boolean }
 * Only admin users can call this function.
 */
exports.setAdminRole = async (req, res) => {
  try {
    const body = parseBody(req.body);
    const decoded = await requireAdmin(req);

    const { userId, isAdmin: shouldBeAdmin } = body;
    validateId(userId, "userId");

    if (typeof shouldBeAdmin !== "boolean") {
      throw { status: 400, message: "isAdmin must be a boolean" };
    }

    // Prevent self-demotion
    if (decoded.uid === userId && !shouldBeAdmin) {
      throw {
        status: 403,
        message: "Cannot remove your own admin privileges",
      };
    }

    // Update both Auth and Firestore
    await admin.auth().setCustomUserClaims(userId, { admin: shouldBeAdmin });
    await admin.firestore().collection("users").doc(userId).update({
      admin: shouldBeAdmin,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const action = shouldBeAdmin ? "promoted to" : "removed from";
    sendSuccess(res, {
      success: true,
      message: `User ${action} admin`,
    });
  } catch (error) {
    handleError(res, error);
  }
};
