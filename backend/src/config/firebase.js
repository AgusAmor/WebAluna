import admin from "firebase-admin";
import { error } from "node:console";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
console.log(error);
const serviceAccount = require("./firebaseServiceAcount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

export { admin, db, auth };
