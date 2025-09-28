const admin = require('firebase-admin');

// Use your local serviceAccount file
const serviceAccount = require('./config/serviceAccount.json'); // <-- Update this path!

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function patchNames() {
  const snapshot = await db.collection('players').get();
  for (const doc of snapshot.docs) {
    const uid = doc.id;
    try {
      // Get user info from Firebase Auth
      const userRecord = await admin.auth().getUser(uid);
      const name = userRecord.displayName || userRecord.email || uid;
      const email = userRecord.email || "unknown";
      await db.collection('players').doc(uid).set({
        name,
        email
      }, { merge: true });
      console.log(`Patched ${uid} with name: ${name} and email: ${email}`);
    } catch (err) {
      console.error(`Could not fetch auth for UID ${uid}:`, err.message);
      await db.collection('players').doc(uid).set({
        name: uid,
        email: "unknown"
      }, { merge: true });
    }
  }
  console.log('All missing names/emails patched.');
}

patchNames().catch(e => console.error(e));