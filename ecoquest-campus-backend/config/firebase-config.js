const admin = require("firebase-admin");
const path = require("path");

function initializeFirebase() {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(
        require(path.join(__dirname, "serverAccount.json"))
        // Or use process.env.GOOGLE_APPLICATION_CREDENTIALS
      ),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
  }
}

function getDB() {
  return admin.firestore();
}

module.exports = { initializeFirebase, getDB, admin };