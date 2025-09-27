import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut } from "../services/firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Check for redirect authentication result on mount
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const firebaseToken = await result.user.getIdToken();
          localStorage.setItem("token", firebaseToken);
          setToken(firebaseToken);
        }
      } catch (error) {
        console.error("Redirect authentication error:", error);
        setAuthError(error.message);
      }
    };
    checkRedirectResult();
  }, []);

  // Clear auth error on mount to start fresh
  useEffect(() => {
    setAuthError(null);
  }, []);

  // Monitor Firebase auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        // User is signed in with Firebase
        const userData = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          level: 1, // Default values
          xp: 0,
          totalPoints: 0,
          dormId: null
        };
        setUser(userData);
        
        // Get and store the token
        firebaseUser.getIdToken().then((idToken) => {
          localStorage.setItem('token', idToken);
          setToken(idToken);
        });
      } else {
        // User is signed out
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const googleSignIn = async () => {
    setAuthLoading(true);
    setAuthError(null);
    const provider = new GoogleAuthProvider();
    
    try {
      // First, try popup authentication
      const result = await signInWithPopup(auth, provider);
      const firebaseToken = await result.user.getIdToken();
      localStorage.setItem("token", firebaseToken);
      setToken(firebaseToken);
      setAuthLoading(false);
    } catch (error) {
      console.error("Popup authentication failed:", error);
      
      // If popup fails (likely due to COOP), fall back to redirect
      if (error.code === 'auth/popup-blocked' || 
          error.code === 'auth/popup-closed-by-user' ||
          error.message.includes('Cross-Origin-Opener-Policy')) {
        
        console.log("Falling back to redirect authentication...");
        try {
          await signInWithRedirect(auth, provider);
          // Note: The redirect will handle the rest, and the result will be
          // caught by the useEffect with getRedirectResult
        } catch (redirectError) {
          console.error("Redirect authentication failed:", redirectError);
          setAuthError(redirectError.message);
          setAuthLoading(false);
        }
      } else {
        setAuthError(error.message);
        setAuthLoading(false);
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    setAuthError(null);
  };

  const clearAuth = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    setAuthError(null);
    console.log('Authentication state cleared');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, authLoading, authError, googleSignIn, logout, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);