import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

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
        video: { 
          facingMode: 'environment', // Use back camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Scan an Object</h2>
        
        {/* Camera Feed */}
        <div className="relative mb-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className={`w-full h-64 object-cover rounded-lg border-2 ${isCameraActive ? 'border-green-500' : 'border-gray-300'}`}
            style={{ display: isCameraActive ? 'block' : 'none' }}
          />
          {!isCameraActive && (
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-300">
              <div className="text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293L12.293 3.293A1 1 0 0011.586 3H8.414a1 1 0 00-.707.293L6.293 4.707A1 1 0 005.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                <p>Camera Preview</p>
              </div>
            </div>
          )}
        </div>

        {/* Hidden canvas for capturing photos */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Camera Controls */}
        <div className="flex gap-2 mb-4">
          {!isCameraActive ? (
            <button
              onClick={startCamera}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Start Camera
            </button>
          ) : (
            <>
              <button
                onClick={handleScan}
                disabled={loading}
                className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {loading ? "Scanning..." : "📸 Scan"}
              </button>
              <button
                onClick={stopCamera}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Stop
              </button>
            </>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold mb-2">Scan Result:</h3>
            <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}