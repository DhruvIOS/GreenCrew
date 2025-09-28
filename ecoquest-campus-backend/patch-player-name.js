const { initializeFirebase, getDB } = require('./config/firebase-config');

async function patchNames() {
  await initializeFirebase();
  const db = getDB();
  const snapshot = await db.collection('players').get();
  for (const doc of snapshot.docs) {
    const data = doc.data();
    // Set name to email if available, otherwise UID
    const name = data.email || doc.id;
    const email = data.email || "user@example.com";
    await db.collection('players').doc(doc.id).set({
      name,
      email
    }, { merge: true });
    console.log(`Patched player ${doc.id} with name: ${name} and email: ${email}`);
  }
  console.log('All missing names patched.');
}

patchNames().catch(e => console.error(e));