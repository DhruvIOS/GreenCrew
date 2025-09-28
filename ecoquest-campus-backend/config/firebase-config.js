const admin = require("firebase-admin");
const path = require("path");

const serviceAccountPath = process.env.GC_SERVICE_ACCOUNT_PATH || path.join(__dirname, "serviceAccount.json");
const serviceAccount = require(serviceAccountPath);

function initializeFirebase() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      // databaseURL: process.env.FIREBASE_DATABASE_URL
    });
  }
}

function getDB() {
  return admin.firestore();
}

module.exports = { initializeFirebase, getDB, admin };