// middleware/authenticateUser.js
const { auth } = require("../config/firebase-config"); // Firebase Admin SDK instance
const { getAuth } = require("firebase-admin/auth"); // for fetching user record

async function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    // Verify ID token
    const decodedToken = await auth.verifyIdToken(idToken);

    // Fetch full user record (this includes displayName if available)
    const userRecord = await getAuth().getUser(decodedToken.uid);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: userRecord.displayName || decodedToken.email, // fallback if no name
    };

    next();
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    res.status(403).json({ message: "Invalid or expired token" });
  }
}

module.exports = authenticateUser;
