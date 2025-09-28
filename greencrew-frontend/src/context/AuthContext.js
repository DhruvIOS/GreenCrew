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

  useEffect(() => { setAuthError(null); }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          level: 1,
          xp: 0,
          totalPoints: 0,
          dormId: null
        };
        setUser(userData);
        firebaseUser.getIdToken().then((idToken) => {
          localStorage.setItem('token', idToken);
          setToken(idToken);
        });
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- ADD THIS: refreshUser ---
  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/player/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(prev => ({ ...prev, ...data.player }));
      }
    } catch (err) {
      console.error("Failed to refresh user profile", err);
    }
  };

  const googleSignIn = async () => {
    setAuthLoading(true);
    setAuthError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseToken = await result.user.getIdToken();
      localStorage.setItem("token", firebaseToken);
      setToken(firebaseToken);
      setAuthLoading(false);
    } catch (error) {
      console.error("Popup authentication failed:", error);
      if (error.code === 'auth/popup-blocked' || 
          error.code === 'auth/popup-closed-by-user' ||
          error.message.includes('Cross-Origin-Opener-Policy')) {
        try {
          await signInWithRedirect(auth, provider);
        } catch (redirectError) {
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
    <AuthContext.Provider value={{ user, token, loading, authLoading, authError, googleSignIn, logout, clearAuth, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);