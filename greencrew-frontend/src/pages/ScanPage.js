import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

// --- Dynamic, Categorized Result Card ---
const formatKey = (key) =>
  key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const categorizeKeys = (obj) => {
  const categories = {
    Object: ["class", "confidence", "name", "bbox", "category"],
    Price: ["estimated", "confidence_level", "breakdown"],
    Environment: ["environment", "env_score", "env_category"],
    Status: ["recyclable", "success", "error"],
    Miscellaneous: [],
  };

  const result = {};
  Object.keys(categories).forEach((cat) => (result[cat] = {}));

  for (const key in obj) {
    // Skip details fields
    if (["id", "scan_id", "timestamp"].includes(key)) continue;
    
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
      <span style={{
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: 'bold',
        backgroundColor: value ? '#10b981' : '#ef4444',
        color: 'white',
        display: 'inline-block'
      }}>
        {value ? "✓ Yes" : "✗ No"}
      </span>
    );
  }
  if (typeof value === "number") {
    if (value >= 0 && value <= 1) {
      return (
        <span style={{
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: 'bold',
          backgroundColor: '#3b82f6',
          color: 'white',
          display: 'inline-block'
        }}>
          {Math.round(value * 100)}%
        </span>
      );
    }
    return <span style={{fontFamily: 'monospace', fontSize: '16px', fontWeight: 'bold'}}>{value}</span>;
  }
  if (typeof value === "object" && value !== null) {
    if (Array.isArray(value)) {
      return (
        <ul style={{listStyle: 'none', padding: 0, margin: '8px 0'}}>
          {value.map((item, idx) => (
            <li key={idx} style={{
              padding: '8px',
              margin: '4px 0',
              backgroundColor: '#f8fafc',
              borderLeft: '4px solid #3b82f6',
              borderRadius: '4px'
            }}>
              {renderValue(item)}
            </li>
          ))}
        </ul>
      );
    }
    return (
      <div style={{
        backgroundColor: '#f1f5f9',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '12px',
        margin: '8px 0'
      }}>
        {Object.entries(value).map(([subKey, subVal], idx) => (
          <div key={idx} style={{marginBottom: '8px'}}>
            <strong>{formatKey(subKey)}:</strong> {renderValue(subVal)}
          </div>
        ))}
      </div>
    );
  }
  return <span style={{fontWeight: '500'}}>{String(value)}</span>;
};

const CategoryCard = ({ title, data }) => {
  if (Object.keys(data).length === 0) return null;
  
  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '20px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      textAlign: 'center'
    }}
    onMouseEnter={(e) => {
      e.target.style.boxShadow = '0 10px 25px 0 rgba(0, 0, 0, 0.15)';
      e.target.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.target.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
      e.target.style.transform = 'translateY(0px)';
    }}>
      <h3 style={{
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#1f2937',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '10px',
        textAlign: 'center'
      }}>{title}</h3>
      
      {Object.entries(data).map(([key, value]) => (
        <div key={key} style={{
          marginBottom: '16px',
          padding: '12px',
          backgroundColor: '#fafbfc',
          borderRadius: '8px',
          border: '1px solid #f3f4f6',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '8px',
            textAlign: 'center'
          }}>
            {formatKey(key)}
          </div>
          <div style={{fontSize: '16px', textAlign: 'center'}}>
            {renderValue(value)}
          </div>
        </div>
      ))}
    </div>
  );
};

const ResultCard = ({ result }) => {
  if (!result || typeof result !== "object") return null;

  const categories = categorizeKeys(result);

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '40px auto',
      padding: '0 20px',
      textAlign: 'center'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <h2 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '16px',
          textAlign: 'center'
        }}>Scan Results</h2>
        <div style={{
          width: '100px',
          height: '4px',
          backgroundColor: '#3b82f6',
          margin: '0 auto',
          borderRadius: '2px'
        }}></div>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '24px',
        alignItems: 'start',
        justifyItems: 'center'
      }}>
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
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '20px',
      textAlign: 'center'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        padding: '40px 0'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '16px',
          textAlign: 'center'
        }}>AI Object Scanner</h1>
        <p style={{
          fontSize: '20px',
          color: '#6b7280',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6',
          textAlign: 'center'
        }}>
          Scan any object to discover its environmental impact, sustainability rating, and more using advanced AI technology.
        </p>
      </div>

      {/* Main Interface */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        marginBottom: '40px',
        textAlign: 'center'
      }}>
        
        {/* Camera Interface */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '40px'
        }}>
          <div style={{
            backgroundColor: '#1f2937',
            borderRadius: '16px',
            padding: '20px',
            maxWidth: '800px',
            width: '100%'
          }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{
                width: '100%',
                height: '400px',
                objectFit: 'cover',
                borderRadius: '12px',
                backgroundColor: '#374151',
                border: isCameraActive ? '3px solid #10b981' : '3px solid #6b7280',
                display: isCameraActive ? 'block' : 'none'
              }}
            />
            {!isCameraActive && (
              <div style={{
                width: '100%',
                height: '400px',
                backgroundColor: '#374151',
                borderRadius: '12px',
                border: '3px dashed #6b7280',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#4b5563',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <svg width="40" height="40" fill="#9ca3af" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293L12.293 3.293A1 1 0 0011.586 3H8.414a1 1 0 00-.707.293L6.293 4.707A1 1 0 015.586 5H4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p style={{
                  color: '#d1d5db',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  marginBottom: '8px'
                }}>Camera Preview</p>
                <p style={{
                  color: '#9ca3af',
                  fontSize: '16px'
                }}>Click "Start Camera" to begin scanning</p>
              </div>
            )}
          </div>
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Error Display */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '32px',
            maxWidth: '800px',
            margin: '0 auto 32px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20" style={{ marginRight: '12px' }}>
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span style={{ fontWeight: '600' }}>{error}</span>
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          {!isCameraActive ? (
            <button
              onClick={startCamera}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#2563eb';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 8px rgba(59, 130, 246, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#3b82f6';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Start Camera
            </button>
          ) : (
            <>
              <button
                onClick={handleScan}
                disabled={loading}
                style={{
                  backgroundColor: loading ? '#9ca3af' : '#10b981',
                  color: 'white',
                  padding: '16px 32px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  opacity: loading ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor = '#059669';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 8px rgba(16, 185, 129, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor = '#10b981';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                {loading ? (
                  <>
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" style={{
                      animation: 'spin 1s linear infinite'
                    }}>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" opacity="0.75" />
                    </svg>
                    Scanning...
                  </>
                ) : (
                  <>
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Scan Object
                  </>
                )}
              </button>
              
              <button
                onClick={stopCamera}
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  padding: '16px 32px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#dc2626';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 8px rgba(239, 68, 68, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#ef4444';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
                Stop Camera
              </button>
            </>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{
            marginTop: '40px',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'inline-block',
              padding: '20px 40px',
              backgroundColor: '#f3f4f6',
              borderRadius: '12px',
              border: '2px dashed #d1d5db'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid #e5e7eb',
                borderTop: '4px solid #3b82f6',
                borderRadius: '50%',
                margin: '0 auto 16px',
                animation: 'spin 1s linear infinite'
              }}></div>
              <p style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#374151',
                margin: 0
              }}>Processing your scan...</p>
            </div>
          </div>
        )}
      </div>

      {/* Results Display */}
      {result && <ResultCard result={result} />}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}