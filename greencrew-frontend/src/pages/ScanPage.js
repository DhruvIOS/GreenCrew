import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

// --- Dynamic, Categorized Result Card ---
const formatKey = (key) =>
  key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const categorizeKeys = (obj) => {
  // Customize these categories based on your API structure!
  const categories = {
    Details: ["id", "scan_id", "timestamp"],
    Object: ["class", "confidence", "name", "bbox", "category"],
    Price: ["estimated", "confidence_level", "breakdown"],
    Environment: ["environment", "env_score", "env_category"],
    Status: ["recyclable", "success", "error"],
    // Any other keys will go in Miscellaneous
    Miscellaneous: [],
  };

  const result = {};
  Object.keys(categories).forEach((cat) => (result[cat] = {}));

  for (const key in obj) {
    let found = false;
    for (const cat in categories) {
      if (categories[cat].includes(key)) {
        result[cat][key] = obj[key];
        found = true;
        break;
      }
    }
    if (!found) {
      result.Miscellaneous[key] = obj[key];
    }
  }
  return result;
};

const renderValue = (value) => {
  if (typeof value === "boolean") {
    return (
      <span
        className={`px-3 py-1 rounded-full font-semibold text-xs ${
          value ? "bg-emerald-100 text-emerald-900" : "bg-red-100 text-red-800"
        }`}
      >
        {value ? "Yes" : "No"}
      </span>
    );
  }
  if (typeof value === "number") {
    // For confidence, show as percent if between 0-1
    if (value >= 0 && value <= 1) {
      return (
        <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium border border-blue-200">
          {Math.round(value * 100)}%
        </span>
      );
    }
    return <span className="font-mono">{value}</span>;
  }
  if (typeof value === "object" && value !== null) {
    if (Array.isArray(value)) {
      return (
        <ul className="list-disc pl-5 text-sm text-gray-700">
          {value.map((item, idx) => (
            <li key={idx}>{renderValue(item)}</li>
          ))}
        </ul>
      );
    }
    // Nested object
    return (
      <div className="bg-gray-50 border-l-4 border-gray-300 p-3 rounded-lg text-gray-700 text-xs my-2">
        {Object.entries(value).map(([subKey, subVal], idx) => (
          <div key={idx} className="mb-1">
            <span className="font-semibold">{formatKey(subKey)}:</span>{" "}
            {renderValue(subVal)}
          </div>
        ))}
      </div>
    );
  }
  return <span>{String(value)}</span>;
};

const CategoryCard = ({ title, data }) => {
  if (Object.keys(data).length === 0) return null;
  return (
    <div className="mb-6 bg-white border shadow-lg rounded-2xl p-6 w-full">
      <div className="text-2xl font-bold text-green-700 mb-4">{title}</div>
      <div className="grid gap-4">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
              {formatKey(key)}
            </span>
            <div className="text-base text-gray-900">{renderValue(value)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ResultCard = ({ result }) => {
  if (!result || typeof result !== "object") return null;

  const categories = categorizeKeys(result);

  return (
    <div className="relative mb-2 w-full">
      <div
        className="backdrop-blur-lg bg-white/90 border shadow-2xl rounded-3xl p-8 flex flex-col gap-6 transition-transform duration-300 hover:scale-[1.02] w-full"
        style={{ boxShadow: "0 16px 48px 0 rgba(31, 38, 135, 0.22)" }}
      >
        {Object.entries(categories).map(([cat, data]) => (
          <CategoryCard key={cat} title={cat} data={data} />
        ))}
      </div>
    </div>
  );
};

export default function ScanPage() {
  const { token } = useAuth();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stream, setStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Start camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
      setIsCameraActive(true);
      setError("");
    } catch (err) {
      setError("Cannot access camera. Please allow camera permissions.");
      console.error("Camera access error:", err);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  };

  // Capture photo from video
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    return new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', 0.8);
    });
  };

  // Handle scan
  const handleScan = async () => {
    if (!isCameraActive) {
      setError("Please start the camera first.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const photoBlob = await capturePhoto();
      if (!photoBlob) {
        setError("Failed to capture photo.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("image", photoBlob, "capture.jpg");

      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/scan`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      setResult(data.result || data.error || data);
    } catch (err) {
      setError("Scan failed.");
      console.error("Scan error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-tr from-green-100 via-white to-green-200 p-10">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 w-full max-w-5xl flex flex-col items-center">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-900 drop-shadow">Scan an Object</h2>
        {/* Camera Feed */}
        <div className="relative mb-8 w-full flex justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className={`w-full max-w-2xl h-80 object-cover rounded-2xl border-4 ${isCameraActive ? 'border-green-400 shadow-lg' : 'border-gray-300'} transition-all`}
            style={{ display: isCameraActive ? 'block' : 'none' }}
          />
          {!isCameraActive && (
            <div className="w-full max-w-2xl h-80 bg-gray-200 rounded-2xl flex items-center justify-center border-4 border-gray-300">
              <div className="text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293L12.293 3.293A1 1 0 0011.586 3H8.414a1 1 0 00-.707.293L6.293 4.707A1 1 0 015.586 5H4z" clipRule="evenodd" />
                </svg>
                <p className="text-lg">Camera Preview</p>
              </div>
            </div>
          )}
        </div>
        {/* Hidden canvas for capturing photos */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6 shadow w-full max-w-3xl">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Camera Controls */}
        <div className="flex gap-6 mb-8 w-full max-w-2xl justify-center">
          {!isCameraActive ? (
            <button
              onClick={startCamera}
              className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-7 py-4 rounded-xl font-semibold shadow-lg text-lg transition-all"
            >
              Start Camera
            </button>
          ) : (
            <>
              <button
                onClick={handleScan}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-500 to-lime-400 hover:from-green-600 hover:to-lime-500 disabled:from-green-300 disabled:to-lime-200 text-white px-7 py-4 rounded-xl font-semibold shadow-lg text-lg transition-all"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Scanning...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span role="img" aria-label="camera">📸</span> Scan
                  </span>
                )}
              </button>
              <button
                onClick={stopCamera}
                className="bg-gradient-to-r from-red-500 to-pink-400 hover:from-red-600 hover:to-pink-500 text-white px-7 py-4 rounded-xl font-semibold shadow-lg text-lg transition-all"
              >
                Stop
              </button>
            </>
          )}
        </div>

        {/* Results */}
        {loading && (
          <div className="animate-pulse bg-gray-100 border border-gray-200 rounded-2xl p-8 mb-4 w-full max-w-4xl">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-3"></div>
            <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-5/6"></div>
          </div>
        )}
        {result && <ResultCard result={result} />}
      </div>
    </div>
  );
}