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
 * Updates the lastLoginAt timestamp for a user.
 * POST /updateLastLogin
 * Body: { uid: string }
 * Only authenticated users can update their own lastLoginAt.
 */
exports.updateLastLogin = async (req, res) => {
  try {
    const body = parseBody(req.body);
    const decoded = await verifyToken(req.headers.authorization);

    const { uid } = body;
    validateId(uid, "uid");

    // Ensure user can only update their own lastLoginAt
    if (decoded.uid !== uid) {
      throw {
        status: 403,
        message: "Cannot update another user's last login timestamp",
      };
    }

    // Update lastLoginAt in Firestore
    await admin.firestore().collection("users").doc(uid).update({
      lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    sendSuccess(res, { success: true });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Deletes a user document and Firebase Auth user.
 * POST /deleteUser
 * Body: { id: string }
 * Users can delete their own account, admins can delete any user.
 */
exports.deleteUser = async (req, res) => {
  try {
    const body = parseBody(req.body);
    const decoded = await verifyToken(req.headers.authorization);
    validateId(body.id, "user id");

    // Check authorization: user can delete their own account or admin can delete any account
    const userIsAdmin = isAdmin(decoded);
    if (!userIsAdmin && decoded.uid !== body.id) {
      throw {
        status: 403,
        message: "You can only delete your own account",
      };
    }

    // Delete from Firestore and Auth
    await admin.firestore().collection("users").doc(body.id).delete();
    await admin.auth().deleteUser(body.id);

    sendSuccess(res, { success: true });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Deletes the current user's own document from Firestore using Admin SDK.
 * POST /deleteSelfUser
 * Body: { uid: string }
 * Used internally when user is already deleted from Firebase Auth.
 * Does NOT require authentication since it's called after Auth deletion.
 */
exports.deleteSelfUser = async (req, res) => {
  try {
    const body = parseBody(req.body);
    validateId(body.uid, "uid");

    // Delete from Firestore only (user already deleted from Auth by client)
    await admin.firestore().collection("users").doc(body.uid).delete();

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

    const { displayName, email, phone, addresses } = body;

    // Build update object with ONLY the fields that were provided
    const updateData = {};
    if (displayName !== undefined) updateData.displayName = displayName;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (addresses !== undefined) updateData.addresses = addresses;

    // At least one field must be provided
    if (Object.keys(updateData).length === 0) {
      throw {
        status: 400,
        message: "At least one field must be provided for update",
      };
    }

    // Validate email if it's being updated
    if (email !== undefined) {
      validateEmail(email);
    }

    // Update Firebase Auth first (only if email or displayName provided)
    try {
      const authUpdate = {};
      if (displayName !== undefined) authUpdate.displayName = displayName;
      if (email !== undefined) authUpdate.email = email;
      if (phone !== undefined) authUpdate.phoneNumber = phone;

      if (Object.keys(authUpdate).length > 0) {
        await admin.auth().updateUser(id, authUpdate);
      }
    } catch (authError) {
      throw {
        status: 400,
        message: authError.message || "Failed to update user in Auth",
      };
    }

    // Prepare Firestore update
    const firestoreUpdate = {
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

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
