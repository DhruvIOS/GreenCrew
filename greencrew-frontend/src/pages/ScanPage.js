import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

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
    <div className="mb-4 border-b border-gray-200 pb-4 last:border-b-0">
      <div className="text-lg font-semibold text-gray-900 mb-3">{title}</div>
      <div className="space-y-3">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex justify-between items-start">
            <span className="text-sm text-gray-600 font-medium">
              {formatKey(key)}
            </span>
            <div className="text-sm text-gray-900 text-right max-w-xs">{renderValue(value)}</div>
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
    <div className="w-full">
      {Object.entries(categories).map(([cat, data]) => (
        <CategoryCard key={cat} title={cat} data={data} />
      ))}
    </div>
  );
};

export default function ScanPage() {
  const { token, user } = useAuth();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stream, setStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
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
    setIsVisible(true);
    return () => stopCamera();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-6 py-3 bg-white">
        <span className="text-black font-medium">9:41</span>
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1 bg-black rounded-full"></div>
          </div>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2 17h20v2H2zm1.15-4.05L4 11l.85 1.95L7 13l-1.15.05L4 15l-1.85-1.95L1 13l2.15-.05zM5 5h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"/>
          </svg>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2 16h20v2H2v-2zm0-5h20v2H2v-2zm0-5h20v2H2V6z"/>
          </svg>
          <div className="w-6 h-4 border border-black rounded-sm relative">
            <div className="w-4 h-2 bg-black rounded-sm absolute top-0.5 left-0.5"></div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="text-blue-500 font-medium">
            ← Back
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Scan and sort</h1>
          <div className="w-12"></div>
        </div>
      </div>

      {/* Bag Selection */}
      <div className="bg-green-100 px-6 py-4">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-gray-700 font-medium">Your bag</span>
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Toggle Buttons */}
      <div className="px-6 py-4 bg-gray-100">
        <div className="flex bg-white rounded-full p-1 shadow-sm">
          <button className="flex-1 flex items-center justify-center py-3 px-4 rounded-full bg-white shadow-sm border border-gray-200">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h4" />
            </svg>
            <span className="text-gray-900 font-medium">Barcode</span>
          </button>
          <button className="flex-1 flex items-center justify-center py-3 px-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
            </svg>
            <span className="text-gray-600 font-medium">No Barcode</span>
          </button>
        </div>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
          style={{ display: isCameraActive ? 'block' : 'none' }}
        />

        {!isCameraActive && (
          <div className="w-full h-96 bg-gray-300 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-lg font-medium">Camera Preview</p>
            </div>
          </div>
        )}

        {/* Scanning overlay - only show when camera is active */}
        {isCameraActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 border-4 border-white rounded-2xl">
              <div className="w-full h-full border-4 border-dashed border-white/50 rounded-xl flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-white"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Canvas for capturing */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-4 my-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Bottom Controls */}
      <div className="bg-white px-6 py-6 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-12">
          {/* Left Icon */}
          <button className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 7a2 2 0 012-2h10a2 2 0 012 2v2M7 7h10" />
            </svg>
          </button>

          {/* Center Capture Button */}
          {!isCameraActive ? (
            <button
              onClick={startCamera}
              className="w-20 h-20 bg-white border-4 border-gray-300 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </button>
          ) : (
            <button
              onClick={handleScan}
              disabled={loading}
              className="w-20 h-20 bg-white border-4 border-gray-300 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <div className="w-16 h-16 bg-white rounded-full border-2 border-gray-300"></div>
              )}
            </button>
          )}

          {/* Right Icons */}
          <div className="flex space-x-3">
            <button className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </button>
            <button className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Camera controls when active */}
        {isCameraActive && (
          <div className="flex justify-center mt-4">
            <button
              onClick={stopCamera}
              className="bg-red-500 text-white px-6 py-2 rounded-full font-medium"
            >
              Stop Camera
            </button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200">
        <div className="flex justify-around items-center py-3">
          <Link to="/dashboard" className="flex flex-col items-center space-y-1">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs text-gray-400">Home</span>
          </Link>
          <Link to="/leaderboard" className="flex flex-col items-center space-y-1">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs text-gray-400">Map</span>
          </Link>
          <div className="flex flex-col items-center space-y-1">
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h4" />
            </svg>
            <span className="text-xs text-green-500 font-medium">Sort</span>
          </div>
          <Link to="/profile" className="flex flex-col items-center space-y-1">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs text-gray-400">Impact</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center space-y-1">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <span className="text-xs text-gray-400">Rewards</span>
          </Link>
        </div>
      </div>

      {/* Results */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 m-4 w-full max-w-sm">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-700">Scanning item...</p>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 m-4 w-full max-w-md max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Scan Result</h3>
              <button
                onClick={() => setResult(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ResultCard result={result} />
          </div>
        </div>
      )}
    </div>
  );
}