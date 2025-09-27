import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { user, loading, authLoading, authError, googleSignIn, clearAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-80">
        <h2 className="text-2xl mb-4 text-center">Login</h2>
        {authError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="text-sm">{authError}</p>
          </div>
        )}
        <button
          type="button"
          onClick={googleSignIn}
          className="w-full bg-red-500 text-white p-2 rounded mb-2 flex items-center justify-center"
          disabled={authLoading}
        >
          {authLoading ? "Signing in..." : "Sign in with Google"}
        </button>
        {authError && (
          <button
            type="button"
            onClick={clearAuth}
            className="w-full bg-gray-500 text-white p-2 rounded mt-2 text-sm"
          >
            Clear Auth & Try Again
          </button>
        )}
      </div>
    </div>
  );
}