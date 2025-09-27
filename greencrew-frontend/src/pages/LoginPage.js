import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { googleSignIn } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    try {
      await googleSignIn();
      navigate("/dashboard");
    } catch (err) {
      setError("Google sign-in failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-80">
        <h2 className="text-2xl mb-4 text-center">Login</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 text-white p-2 rounded mb-2"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
