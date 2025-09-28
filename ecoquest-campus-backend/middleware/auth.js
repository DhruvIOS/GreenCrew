const { admin } = require("../config/firebase-config"); // Import the initialized admin SDK

async function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    // Verify ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Fetch full user record (includes displayName if available)
    const userRecord = await admin.auth().getUser(decodedToken.uid);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: userRecord.displayName || decodedToken.email,
    };

    next();
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    res.status(403).json({ message: "Invalid or expired token" });
  }
}

module.exports = authenticateUser;