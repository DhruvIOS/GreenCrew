const admin = require('firebase-admin');
let db, auth;

async function initializeFirebase() {
  try {
    const serviceAccount = require('/etc/secrets/serviceAccount.json');
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    db = admin.firestore();
    auth = admin.auth();
    
    console.log('🔥 Firebase initialized');
    return { db, auth };
  } catch (error) {
    console.log('⚠️ Firebase not configured yet');
    return null;
  }
}

module.exports = { initializeFirebase, getDB: () => db, getAuth: () => auth };