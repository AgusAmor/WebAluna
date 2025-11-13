const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// Firebase Admin SDK initialization for pure Firebase Functions

/**
 * Initialize Firebase Admin SDK with service account credentials
 * Used for all Firebase Functions endpoints
 * databaseURL must match your Firestore region/project
 */

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://aluna-1af1f.firebaseio.com",
  });
}

module.exports = admin;
