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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "linear-gradient(135deg,#0d1117 0%,#1f2937 50%,#111827 100%)",
        color: "#fff",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Left Illustration / Branding */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "500px" }}>
          <img
            src="/images/gamefi.png" // 👉 replace with your Gemini-generated image
            alt="Eco Gamification"
            style={{
              width: "100%",
              maxWidth: "400px",
              marginBottom: "20px",
              filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.5))",
            }}
          />
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "900",
              background: "linear-gradient(90deg,#10b981,#60a5fa)",
              WebkitBackgroundClip: "text",
              color: "transparent",
              marginBottom: "12px",
            }}
          >
            GreenCrew
          </h1>
          <p style={{ fontSize: "16px", color: "#9ca3af" }}>
            Gamify your impact. Earn points for every sustainable action.
          </p>
        </div>
      </div>

      {/* Right Login Card */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "20px",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            padding: "48px 36px",
            width: "100%",
            maxWidth: "380px",
            textAlign: "center",
            boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "800",
              marginBottom: "20px",
              color: "#f9fafb",
            }}
          >
            Sign in to continue
          </h2>

          {authError && (
            <div
              style={{
                background: "rgba(255,0,0,0.1)",
                border: "1px solid rgba(255,0,0,0.3)",
                color: "#ff6b6b",
                padding: "12px 16px",
                borderRadius: "12px",
                marginBottom: "16px",
              }}
            >
              {authError}
            </div>
          )}

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={googleSignIn}
            disabled={authLoading}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              background: "#fff",
              color: "#202124",
              fontWeight: "500",
              padding: "12px 0",
              borderRadius: "8px",
              fontSize: "16px",
              border: "1px solid #dadce0",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              cursor: authLoading ? "not-allowed" : "pointer",
              transition: "all 0.25s",
            }}
            onMouseEnter={(e) =>
              !authLoading &&
              (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 2px 4px rgba(0,0,0,0.1)")
            }
          >
            <img
              src="images/google.png"
              alt="Google Logo"
              style={{ width: "20px", height: "20px" }}
            />
            {authLoading ? "Signing in..." : "Sign in with Google"}
          </button>

          {authError && (
            <button
              type="button"
              onClick={clearAuth}
              style={{
                width: "100%",
                marginTop: "16px",
                background: "rgba(255,255,255,0.15)",
                color: "#eee",
                fontWeight: "500",
                padding: "12px 0",
                borderRadius: "12px",
                fontSize: "14px",
                border: "1px solid rgba(255,255,255,0.25)",
                cursor: "pointer",
                transition: "all 0.25s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.25)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.15)")
              }
            >
              Clear Auth & Try Again
            </button>
          )}

          {/* Small footer note */}
          <p
            style={{
              marginTop: "24px",
              fontSize: "12px",
              color: "#9ca3af",
            }}
          >
            By signing in, you agree to GreenCrew’s{" "}
            <span style={{ color: "#10b981", cursor: "pointer" }}>
              Terms of Service
            </span>{" "}
            and{" "}
            <span style={{ color: "#10b981", cursor: "pointer" }}>
              Privacy Policy
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
